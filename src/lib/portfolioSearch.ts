export type SearchTarget =
  | { kind: 'anchor'; href: string }
  | { kind: 'project'; projectId: string };

export interface SearchDocument {
  id: string;
  title: string;
  monoTitle?: boolean;
  snippet: string;
  /** Shown as "관련 키워드" hints when they match the query. */
  keywords: string[];
  /** Scored like keywords but never displayed (e.g. ranking-algorithm names). */
  hiddenKeywords?: string[];
  meta: string;
  target: SearchTarget;
}

export interface TextSegment {
  text: string;
  hit: boolean;
}

export interface SearchResult {
  document: SearchDocument;
  score: number;
  titleSegments: TextSegment[];
  snippetSegments: TextSegment[];
  keywordMatches: string[];
}

const RESULT_LIMIT = 3;
const KEYWORD_MATCH_LIMIT = 3;
const MIN_HINT_TOKEN_LENGTH = 2;

function keywordWords(keyword: string): string[] {
  return keyword.toLowerCase().split(/[\s·/_-]+/).filter(Boolean);
}

/** A keyword is hinted only when one of its words starts with a query token of 2+ characters. */
function matchesKeywordHint(keyword: string, hintTokens: string[]): boolean {
  const words = keywordWords(keyword);
  return hintTokens.some((token) => words.some((word) => word.startsWith(token)));
}

export function tokenize(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
}

export function countMatches(text: string, tokens: string[]): number {
  const haystack = text.toLowerCase();
  let total = 0;
  for (const token of tokens) {
    const needle = token.toLowerCase();
    let at = haystack.indexOf(needle);
    while (at !== -1) {
      total += 1;
      at = haystack.indexOf(needle, at + needle.length);
    }
  }
  return total;
}

export function segmentText(text: string, tokens: string[]): TextSegment[] {
  if (tokens.length === 0) return [{ text, hit: false }];
  const escaped = tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  return text
    .split(pattern)
    .filter((part) => part !== '')
    .map((part) => ({
      text: part,
      hit: tokens.some((token) => token.toLowerCase() === part.toLowerCase()),
    }));
}

function toResult(document: SearchDocument, score: number, tokens: string[]): SearchResult {
  const visible = `${document.title} ${document.snippet}`.toLowerCase();
  const hintTokens = tokens
    .map((token) => token.toLowerCase())
    .filter((token) => token.length >= MIN_HINT_TOKEN_LENGTH);
  const keywordMatches =
    hintTokens.length === 0
      ? []
      : document.keywords
          .filter((keyword) => matchesKeywordHint(keyword, hintTokens))
          .filter((keyword) => !visible.includes(keyword.toLowerCase()))
          .slice(0, KEYWORD_MATCH_LIMIT);

  return {
    document,
    score,
    titleSegments: segmentText(document.title, tokens),
    snippetSegments: segmentText(document.snippet, tokens),
    keywordMatches,
  };
}

export function searchDocuments(
  documents: readonly SearchDocument[],
  query: string,
  limit: number = RESULT_LIMIT
): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return documents.slice(0, limit).map((document) => toResult(document, 0, tokens));
  }

  return documents
    .map((document, index) => ({
      document,
      index,
      score:
        countMatches(document.title, tokens) * 3 +
        countMatches(document.snippet, tokens) * 2 +
        countMatches([...document.keywords, ...(document.hiddenKeywords ?? [])].join(' '), tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((entry) => toResult(entry.document, entry.score, tokens));
}
