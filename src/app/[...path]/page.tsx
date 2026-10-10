import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { seedProducts } from '@/data/seed';
import { CatalogPage, ProductDetail, Cart, Checkout } from '@/features/storefront';
import {
  AdminShell,
  Dashboard,
  AdminProducts,
  ProductEditor,
  AdminCategories,
  AdminContent,
} from '@/features/admin';
type Props = {
  params: Promise<{ path: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const names: Record<string, string> = {
  women: 'Women',
  men: 'Men',
  new: 'New arrivals',
  search: '검색',
  wishlist: '찜 목록',
  cart: '장바구니',
  'checkout-demo': '모의 주문 완료',
  admin: '관리자 데모',
};
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { path } = await params;
  const product = path[0] === 'products' ? seedProducts.find((p) => p.slug === path[1]) : undefined;
  const url = '/' + path.join('/');
  const filtered = Object.keys(await searchParams).length > 0;
  const privatePage =
    ['admin', 'search', 'cart', 'wishlist', 'checkout-demo'].includes(path[0]) ||
    (path[0] === 'products' && !product);
  return {
    title: product?.name ?? names[path[0]] ?? 'EONVE',
    description:
      product?.description ?? 'EONVE 컬렉션. 일상을 위한 컨템포러리 스타일을 만나보세요.',
    alternates: { canonical: url },
    robots: privatePage ? { index: false, follow: false } : { index: !filtered, follow: true },
    openGraph: product
      ? { title: product.name, description: product.description, images: product.images }
      : undefined,
  };
}
export default async function Page({ params }: Props) {
  const { path } = await params;
  const [root, second, third, fourth] = path;
  let content: React.ReactNode;
  if (path.length === 1 && ['women', 'men', 'new', 'search', 'wishlist'].includes(root))
    content = (
      <Suspense fallback={<p className="loading">컬렉션을 불러오는 중입니다…</p>}>
        <CatalogPage mode={root as 'women' | 'men' | 'new' | 'search' | 'wishlist'} />
      </Suspense>
    );
  else if (root === 'products' && path.length === 2) {
    const seed = seedProducts.find((p) => p.slug === second);
    content = (
      <>
        {seed && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: seed.name,
                description: seed.description,
                image: seed.images.map(
                  (img) => (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000') + img,
                ),
                brand: { '@type': 'Brand', name: 'EONVE' },
                category: seed.category,
              }).replaceAll('<', '\\u003c'),
            }}
          />
        )}
        <ProductDetail slug={second} />
      </>
    );
  } else if (root === 'cart' && path.length === 1) content = <Cart />;
  else if (root === 'checkout-demo' && path.length === 1) content = <Checkout />;
  else if (root === 'admin') {
    let admin: React.ReactNode;
    if (path.length === 1) admin = <Dashboard />;
    else if (second === 'products' && path.length === 2) admin = <AdminProducts />;
    else if (second === 'products' && third === 'new' && path.length === 3)
      admin = <ProductEditor />;
    else if (second === 'products' && fourth === 'edit' && path.length === 4)
      admin = <ProductEditor id={third} />;
    else if (second === 'categories' && path.length === 2) admin = <AdminCategories />;
    else if (second === 'content' && path.length === 2) admin = <AdminContent />;
    else notFound();
    content = <AdminShell>{admin}</AdminShell>;
  } else notFound();
  return content;
}
