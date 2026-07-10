import type { Metadata } from 'next';
import {
  Fraunces,
  Geist_Mono,
  Noto_Sans_KR,
  Noto_Serif_KR,
} from 'next/font/google';
import './globals.css';

const notoSansKr = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  weight: 'variable',
  subsets: ['latin'],
  display: 'swap',
});

const notoSerifKr = Noto_Serif_KR({
  variable: '--font-noto-serif-kr',
  weight: 'variable',
  subsets: ['latin'],
  display: 'swap',
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${notoSerifKr.variable} ${fraunces.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <a
          href="#main-content"
          className="skip-link sr-only z-[100] rounded-md bg-[#1f1b16] px-4 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}
