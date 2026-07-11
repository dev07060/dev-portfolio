import type { Metadata } from 'next';
import Portfolio from '@/components/Portfolio';
import { freelancerPortfolioConfig } from '@/data/freelancer';

export const metadata: Metadata = {
  title: '오병희 | 프리랜서 프로젝트 포트폴리오',
  description:
    '모바일 제품화와 문서·PDF 검색/RAG 프로젝트 수행 경험을 정리한 전달용 포트폴리오입니다.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function FreelancerPage() {
  return <Portfolio config={freelancerPortfolioConfig} />;
}
