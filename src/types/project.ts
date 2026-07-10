export interface Screen {
  id: string;
  title: string;
  desc: string;
  imageAlt: string;
  imagePath?: string;
  scrollable?: boolean;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export type ProjectCardVariant =
  | 'architecture'
  | 'live-query'
  | 'product-screenshot'
  | 'default';

export interface ProjectCardPresentation {
  variant?: ProjectCardVariant;
  description?: string;
  evidenceBadges?: string[];
  thumbnailScreenIndex?: number;
  highlight?: string;
}

export interface Project {
  id: string;
  type: 'mobile' | 'web' | 'tablet' | 'package';
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  evidenceBadges?: string[];
  implementationPoints?: string[];
  releaseLabel?: string;
  cardPresentation?: ProjectCardPresentation;
  color: string;
  iconType:
    | 'zap'
    | 'globe'
    | 'smartphone'
    | 'layers'
    | 'tablet'
    | 'brain'
    | 'utensils'
    | 'activity'
    | 'heart'
    | 'dumbbell'
    | 'scale';
  screens: Screen[];
  links?: ProjectLink[];
}
