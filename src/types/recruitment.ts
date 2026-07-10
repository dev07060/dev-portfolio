export interface EvidenceLink {
  label: string;
  url: string;
  kind: 'github' | 'pubdev' | 'live' | 'docs' | 'article';
}

export interface RecruitmentCase {
  projectId: string;
  publicStatus: string;
  role?: string;
  period?: string;
  team?: string;
  problem: string;
  contributions: string[];
  verification: string[];
  outcomes: string[];
  tradeoffs: string[];
  nonGoals: string[];
  evidenceLinks: EvidenceLink[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  employmentType: string;
  period: string;
  summary: string;
  highlights: string[];
  relatedProjectIds: string[];
}

export interface RecruitmentProfile {
  name: string;
  englishName: string;
  role: string;
  position: string;
  positioning: string;
  email: string;
  githubUrl: string;
  resumeUrl?: string;
  proofItems: Array<{
    label: string;
    value: string;
    evidence?: string;
  }>;
}
