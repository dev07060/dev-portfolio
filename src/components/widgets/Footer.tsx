import SectionContainer from './SectionContainer';

const Footer = () => (
  <footer className="border-t border-[#e8dfd0] py-8 text-sm text-[#756b60]">
    <SectionContainer className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
      <span className="font-serif italic">
        © {new Date().getFullYear()} 오병희
      </span>
      <span className="font-mono text-xs tracking-[0.18em]">
        Next.js로 설계하고 구현했습니다
      </span>
    </SectionContainer>
  </footer>
);

export default Footer;
