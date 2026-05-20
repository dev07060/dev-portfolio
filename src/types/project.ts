import { LocaleText } from '@/i18n';

export interface Screen {
  title: LocaleText;
  desc: LocaleText;
  imagePath?: string;
  scrollable?: boolean; // true면 긴 이미지를 스크롤 가능하게 표시
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  type: 'mobile' | 'web' | 'tablet';
  title: LocaleText;
  subtitle: LocaleText;
  description: LocaleText;
  techStack: string[];
  implementationPoints?: LocaleText[];
  releaseLabel?: LocaleText;
  color: string;
  iconType: 'zap' | 'globe' | 'smartphone' | 'layers' | 'tablet' | 'brain' | 'utensils' | 'activity' | 'heart' | 'dumbbell' | 'scale';
  screens: Screen[];
  links?: ProjectLink[];
}
