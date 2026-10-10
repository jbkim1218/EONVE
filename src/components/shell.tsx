'use client';
import { usePathname } from 'next/navigation';
import { Header, Footer, FloatingSidebar } from './layout';
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith('/admin')) return <>{children}</>;
  return (
    <>
      <a href="#main-content" className="skip-link">
        본문으로 이동
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingSidebar />
    </>
  );
}
