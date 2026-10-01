import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans_KR } from 'next/font/google';
import './globals.css';

const plexSansKr = IBM_Plex_Sans_KR({
  variable: '--font-plex-sans-kr',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '오병희 | Flutter · 온디바이스 RAG 개발자',
  description:
    'Flutter 모바일 제품과 온디바이스 검색 엔진을 설계·구현하고 평가와 운영까지 연결하는 개발자 오병희의 포트폴리오입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${plexSansKr.variable} ${plexMono.variable}`}>
      <body className="antialiased">
        <a
          href="#main-content"
          className="skip-link sr-only z-[100] rounded-md bg-marker px-4 py-3 text-sm font-semibold text-ground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}
