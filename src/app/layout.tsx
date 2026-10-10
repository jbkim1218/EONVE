import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from '@/components/providers';
import { Shell } from '@/components/shell';
import './globals.css';
const bodyFont = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-body',
  weight: '100 900',
  display: 'swap',
  adjustFontFallback: 'Arial',
});
const headingFont = localFont({
  src: '../../public/fonts/CormorantGaramond.ttf',
  variable: '--font-heading',
  weight: '300 700',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'EONVE — Beautiful by Design', template: '%s | EONVE' },
  description: '이온브. 자연스러운 실루엣과 섬세한 소재로 완성하는 컨템포러리 패션 포트폴리오.',
  openGraph: {
    title: 'EONVE',
    description: 'Beautiful by Design. Effortless by Nature.',
    images: ['/images/hero.png'],
    locale: 'ko_KR',
    type: 'website',
  },
  icons: { icon: '/images/eonve-logo.png' },
  alternates: { canonical: '/' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
