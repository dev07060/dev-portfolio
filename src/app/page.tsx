import Portfolio from '@/components/Portfolio';
import { parseAudience } from '@/data/conversion';

interface HomeProps {
  searchParams?: Promise<{
    audience?: string | string[];
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  // Missing or invalid audience values fall back to /?audience=client.
  const audience = parseAudience(params?.audience);

  return <Portfolio initialAudience={audience} />;
}
