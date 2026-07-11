import Portfolio from '@/components/Portfolio';
import { recruitmentPortfolioConfig } from '@/data/portfolio';

export default function Home() {
  return <Portfolio config={recruitmentPortfolioConfig} />;
}
