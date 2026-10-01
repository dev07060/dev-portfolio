export interface EvidenceLink {
  label: string;
  url: string;
  kind: 'github' | 'pubdev' | 'live' | 'docs' | 'article';
}

export interface SupportingPackage {
  name: string;
  version: string;
  relationship: string;
  techStack: string[];
  links: EvidenceLink[];
}

export interface IntroTopic {
  label: string;
  title: string;
  body: string;
  flow?: string;
}

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseFeature {
  title: string;
  description: string;
}

export interface CaseStepScreen {
  screenId: string;
  label: string;
}

export interface CaseFigure {
  screenId: string;
  caption: string;
}

export interface RecruitmentCase {
  projectId: string;
  statusLabel: string;
  role?: string;
  period?: string;
  team?: string;
  problem: string;
  contributions: string[];
  verificationLabel?: string;
  verification: string[];
  outcomes: string[];
  tradeoffs: string[];
  nonGoals: string[];
  evidenceLinks: EvidenceLink[];
  supportingPackages?: SupportingPackage[];
  sectionTitle?: string;
  sectionLead?: string;
  sectionSummary?: string;
  metrics?: CaseMetric[];
  introTopics?: IntroTopic[];
  features?: CaseFeature[];
  stepScreens?: CaseStepScreen[];
  figure?: CaseFigure;
  relatedProjectIds?: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  employmentType: string;
  period: string;
  summary: string;
  highlights: string[];
  relatedProjectIds: string[];
  cardHighlight?: string;
}

export interface RecruitmentProfile {
  name: string;
  role: string;
  position: string;
  positioning: string;
  headline?: string;
  intro?: string;
  email: string;
  githubUrl: string;
  resumeUrl?: string;
  proofItems: Array<{
    label: string;
    value: string;
    evidence?: string;
  }>;
}
