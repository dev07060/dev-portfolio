import type { SearchDocument } from './portfolioSearch';

export function buildCaseOrder(
  featuredIds: readonly string[],
  additionalIds: readonly string[]
): string[] {
  return [...featuredIds, ...additionalIds.filter((id) => !featuredIds.includes(id))];
}

export function caseNumber(order: readonly string[], projectId: string): number | null {
  const index = order.indexOf(projectId);
  return index === -1 ? null : index + 1;
}

export function caseAnchorId(number: number): string {
  return `case-${String(number).padStart(2, '0')}`;
}

export function resolveSearchDocuments(
  documents: readonly SearchDocument[],
  featuredIds: readonly string[]
): SearchDocument[] {
  return documents.map((document) => {
    if (document.target.kind !== 'project') return document;
    const index = featuredIds.indexOf(document.target.projectId);
    if (index === -1) return document;
    return { ...document, target: { kind: 'anchor', href: `#${caseAnchorId(index + 1)}` } };
  });
}

export function findOtherProjectIds(
  order: readonly string[],
  featuredCount: number,
  linkedIds: Iterable<string>
): string[] {
  const linked = new Set(linkedIds);
  return order.slice(featuredCount).filter((id) => !linked.has(id));
}
