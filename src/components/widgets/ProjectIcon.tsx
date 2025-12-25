import { Zap, Globe, Smartphone, Layers, Tablet, Brain, Utensils, Activity, Heart, Dumbbell } from 'lucide-react';

interface ProjectIconProps {
  iconType: 'zap' | 'globe' | 'smartphone' | 'layers' | 'tablet' | 'brain' | 'utensils' | 'activity' | 'heart' | 'dumbbell';
  size?: number;
  className?: string;
}

const iconMap = {
  zap: Zap,
  globe: Globe,
  smartphone: Smartphone,
  layers: Layers,
  tablet: Tablet,
  brain: Brain,
  utensils: Utensils,
  activity: Activity,
  heart: Heart,
  dumbbell: Dumbbell,
};

const ProjectIcon = ({ iconType, size = 48, className = 'text-white' }: ProjectIconProps) => {
  const IconComponent = iconMap[iconType];
  return <IconComponent size={size} className={className} />;
};

export default ProjectIcon;
