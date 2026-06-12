import { LocaleText, LocalizedString } from '@/i18n';
import type { Audience } from '@/data/conversion';

export interface Screen {
  title: LocaleText;
  desc: LocaleText;
  imagePath?: LocalizedString;
  scrollable?: boolean; // true면 긴 이미지를 스크롤 가능하게 표시
}

export interface ProjectLink {
  label: string;
  url: string;
}

export type ProjectCardVariant = 'architecture' | 'live-query' | 'product-screenshot' | 'default';

export interface ProjectAudienceOverride {
  variant?: ProjectCardVariant;
  description?: LocaleText;
  evidenceBadges?: string[];
  thumbnailScreenIndex?: number;
  highlight?: LocaleText;
}

export interface Project {
  id: string;
  type: 'mobile' | 'web' | 'tablet' | 'package';
  title: LocaleText;
  subtitle: LocaleText;
  description: LocaleText;
  techStack: string[];
  evidenceBadges?: string[];
  implementationPoints?: LocaleText[];
  releaseLabel?: LocaleText;
  audienceOverrides?: Partial<Record<Audience, ProjectAudienceOverride>>;
  color: string;
  iconType: 'zap' | 'globe' | 'smartphone' | 'layers' | 'tablet' | 'brain' | 'utensils' | 'activity' | 'heart' | 'dumbbell' | 'scale';
  screens: Screen[];
  links?: ProjectLink[];
}
