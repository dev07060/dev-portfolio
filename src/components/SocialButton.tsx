import { ReactNode } from 'react';

interface SocialButtonProps {
  icon: ReactNode;
  label: string;
  href?: string;
}

const SocialButton = ({ icon, label, href = '#' }: SocialButtonProps) => (
  <a
    href={href}
    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 hover:border-slate-500"
    aria-label={label}
  >
    {icon}
  </a>
);

export default SocialButton;
