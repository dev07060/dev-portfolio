export interface Screen {
  title: string;
  desc: string;
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
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  color: string;
  iconType: 'zap' | 'globe' | 'smartphone' | 'layers' | 'tablet' | 'brain' | 'utensils' | 'activity' | 'heart' | 'dumbbell';
  screens: Screen[];
  links?: ProjectLink[];
}
