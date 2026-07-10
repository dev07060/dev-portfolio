import type { ReactNode } from 'react';

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
}

const SectionContainer = ({ children, className = '' }: SectionContainerProps) => (
  <div className={`mx-auto max-w-7xl px-5 sm:px-6 ${className}`}>{children}</div>
);

export default SectionContainer;
