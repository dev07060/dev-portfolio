import { ReactNode } from 'react';

interface SocialButtonProps {
  icon: ReactNode;
  label: string;
  href?: string;
}

const SocialButton = ({ icon, label, href = '#' }: SocialButtonProps) => (
  <a
    href={href}
    className="p-2.5 bg-white rounded-full text-[#4a4339] hover:text-[#b8543a] hover:bg-[#f2ede4] transition-all border border-[#e8dfd0] hover:border-[#b8543a]/40"
    aria-label={label}
  >
    {icon}
  </a>
);

export default SocialButton;
