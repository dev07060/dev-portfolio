import type {
  ExperienceItem,
  RecruitmentCase,
  RecruitmentProfile,
} from './recruitment';

export interface Capability {
  title: string;
  evidence: string;
}

export interface PortfolioCopy {
  navBrandLabel: string;
  heroEyebrow: string;
  capabilityAriaLabel: string;
  primaryCta: string;
  contactCta: string;
  contactMailSubject?: string;
  featuredEyebrow: string;
  featuredHeading: string;
  featuredDescription: string;
  experienceDescription: string;
  additionalHeading: string;
  additionalDescription: string;
  contactHeading: string;
  contactDescription: string;
}

export interface PortfolioConfig {
  profile: RecruitmentProfile;
  copy: PortfolioCopy;
  capabilities: Capability[];
  featuredProjectIds: readonly string[];
  additionalProjectIds: readonly string[];
  cases: RecruitmentCase[];
  experienceItems: ExperienceItem[];
}
