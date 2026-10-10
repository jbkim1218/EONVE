'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  SlidersHorizontal,
  Search,
  Minus,
  Plus,
  X,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { useCatalog } from '@/components/providers';
import { Photo, Drawer } from '@/components/ui';
import { useShop } from '@/lib/store';
import { filterProducts, money, cartTotals, lineKey } from '@/lib/catalog';
import { colors, type Product } from '@/data/seed';

export function ProductCard({ product: p }: { product: Product }) {
  const wished = useShop((s) => s.wishlist.includes(p.id)),
    toggle = useShop((s) => s.toggle),
    { toast } = useCatalog();
  return (
    <article className="product-card">
      <div className="product-image">
        <Link href={`/products/${p.slug}`} aria-label={`${p.name} 상품 상세`}>
          <Photo src={p.images[0]} alt={`${p.colors[0]} ${p.name} 모델 착용컷`} />
        </Link>
        {p.isNew && <span className="new-badge">NEW</span>}
        <button
          className={`wish-button icon-button ${wished ? 'wished' : ''}`}
          aria-label={`${p.name} ${wished ? '찜 해제' : '찜하기'}`}
          aria-pressed={wished}
          onClick={() => {
            toggle(p.id);
            toast(wished ? '찜 목록에서 삭제했습니다.' : '찜 목록에 담았습니다.');
          }}
        >
          <Heart size={19} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-info">
        <Link href={`/products/${p.slug}`}>{p.name}</Link>
        <span>{money(p.price)}</span>
      </div>
      <div className="swatches">
        {p.colors.map((c) => (
          <span key={c} style={{ background: colors[c] ?? c }} title={c} />
        ))}
        <span className="swatch-name">{p.colors.join(' / ')}</span>
      </div>
    </article>
  );
}
function SectionHeading({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <Link href={href} className="text-link">
        전체 보기 <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
export function Home() {
  const { catalog } = useCatalog(),
    { content, products } = catalog;
  return (
    <>
      <section className="hero">
        <Image
          src={content.image}
          alt="샌드 코트와 올리브 셔츠로 완성한 EONVE 가을 컬렉션 화보"
          fill
          priority
          sizes="100vw"
          unoptimized={content.image.startsWith('https:')}
        />
        <div className="hero-content">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.subtitle}</p>
          <Link href={content.link} className="hero-cta">
            컬렉션 만나보기 <ArrowRight size={18} />
          </Link>
        </div>
        <div className="hero-bottom">
          <span>EONVE — A NEW PERSPECTIVE</span>
          <span>01 / AUTUMN 2026</span>
        </div>
      </section>
      <div className="brand-strip">
        <span>THOUGHTFULLY DESIGNED.</span>
        <span>자연스러운 나만의 균형.</span>
        <span>MADE FOR YOUR EVERYDAY.</span>
      </div>
      <section className="section">
        <SectionHeading eyebrow="EXPLORE YOUR STYLE" title="A wardrobe, your way." href="/new" />
        <div className="category-grid">
          {[
            ['women', 'WOMEN', 'For every version of you.', 'w01'],
            ['men', 'MEN', 'Quiet confidence, everyday.', 'm02'],
          ].map(([gender, title, desc, id]) => (
            <Link className="category-tile" href={`/${gender}`} key={gender}>
              <Photo src={`/images/${id}.png`} alt={`${title} 컬렉션`} sizes="50vw" />
              <div>
                <span className="eyebrow">{desc}</span>
                <h3>{title}</h3>
                <span className="round-arrow">
                  <ArrowUpRight size={26} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section arrivals">
        <SectionHeading eyebrow="THE LATEST CHAPTER" title="New arrivals" href="/new" />
        <div className="product-grid">
          {products
            .filter((p) => p.isNew)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="editor">
        <div className="editor-photo">
          <Photo src="/images/w10.png" alt="블랙 컬럼 드레스를 입은 모델" sizes="50vw" />
        </div>
        <div className="editor-copy">
          <span className="eyebrow">THE EONVE EDIT / 01</span>
          <h2>
            Less, but
            <br />
            <em>better.</em>
          </h2>
          <p>
            좋아하는 옷을 입는 단순한 기쁨.
            <br />
            계절을 넘어 함께할 에센셜을 발견해보세요.
          </p>
          <Link href="/new?featured=1" className="text-link">
            에디터의 선택 <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="CURATED FOR YOU" title="Editor's pick" href="/new?featured=1" />
        <div className="product-grid">
          {products
            .filter((p) => p.isFeatured)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </>
  );
}
export function CatalogPage({ mode }: { mode: 'women' | 'men' | 'new' | 'search' | 'wishlist' }) {
  const { catalog } = useCatalog(),
    wishlist = useShop((s) => s.wishlist),
    params = useSearchParams(),
    router = useRouter(),
    [filtersOpen, setFiltersOpen] = useState(false),
    [query, setQuery] = useState(params.get('q') ?? '');
  const titles = {
    women: 'Women',
    men: 'Men',
    new: 'New arrivals',
    search: 'Search',
    wishlist: '위시리스트',
  };
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/${mode}?${next.toString()}`, { scroll: false });
  };
  let source =
    mode === 'wishlist'
      ? catalog.products.filter((p) => wishlist.includes(p.id))
      : catalog.products;
  if (params.get('featured') === '1') source = source.filter((p) => p.isFeatured);
  const products = filterProducts(source, {
    q: params.get('q') ?? '',
    gender: ['women', 'men'].includes(mode) ? mode : undefined,
    onlyNew: mode === 'new' && params.get('featured') !== '1',
    category: params.get('category') ?? '',
    color: params.get('color') ?? '',
    size: params.get('size') ?? '',
    max: Number(params.get('max')) || undefined,
    sort: params.get('sort') ?? '',
  });
  const categories = catalog.categories
    .filter((c) => !['women', 'men'].includes(mode) || c.gender === mode)
    .map((c) => c.name)
    .filter((v, i, a) => a.indexOf(v) === i);
  const applied = ['category', 'color', 'size', 'max'].filter((k) => params.get(k));
  const controls = (
    <div className="filter-controls">
      <label>
        카테고리
        <select
          value={params.get('category') ?? ''}
          onChange={(e) => set('category', e.target.value)}
        >
          <option value="">전체</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        색상
        <select value={params.get('color') ?? ''} onChange={(e) => set('color', e.target.value)}>
          <option value="">모든 색상</option>
          {Object.keys(colors).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        사이즈
        <select value={params.get('size') ?? ''} onChange={(e) => set('size', e.target.value)}>
          <option value="">모든 사이즈</option>
          {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        최대 가격
        <select value={params.get('max') ?? ''} onChange={(e) => set('max', e.target.value)}>
          <option value="">제한 없음</option>
          <option value="100000">100,000원</option>
          <option value="150000">150,000원</option>
          <option value="200000">200,000원</option>
        </select>
      </label>
    </div>
  );
  return (
    <section className="section catalog-page">
      <div className="page-heading">
        <span className="eyebrow">EONVE COLLECTION</span>
        <h1>{params.get('featured') === '1' ? "Editor's pick" : titles[mode]}</h1>
        <p>
          {mode === 'wishlist'
            ? '마음에 머문 스타일을 모아보세요.'
            : '자연스러운 실루엣과 섬세한 소재. 나다운 일상을 위한 옷.'}
        </p>
      </div>
      {mode === 'search' && (
        <form
          className="catalog-search"
          onSubmit={(e) => {
            e.preventDefault();
            set('q', query);
          }}
        >
          <label className="sr-only" htmlFor="catalog-q">
            상품 검색
          </label>
          <input
            id="catalog-q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="상품명 또는 카테고리 검색"
          />
          <button type="submit" className="icon-button" aria-label="상품 검색">
            <Search />
          </button>
        </form>
      )}
      <div className="catalog-toolbar">
        <div className="category-tabs">
          <button
            className={!params.get('category') ? 'selected' : ''}
            onClick={() => set('category', '')}
          >
            전체
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={params.get('category') === c ? 'selected' : ''}
              onClick={() => set('category', c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="sort-filter">
          <button className="filter-button" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal size={17} />
            필터 {applied.length > 0 && `(${applied.length})`}
          </button>
          <label className="sr-only" htmlFor="sort">
            정렬
          </label>
          <select
            id="sort"
            value={params.get('sort') ?? ''}
            onChange={(e) => set('sort', e.target.value)}
          >
            <option value="">신상품순</option>
            <option value="price-asc">가격 낮은순</option>
            <option value="price-desc">가격 높은순</option>
          </select>
        </div>
      </div>
      <div className="catalog-summary">
        <span>
          {products.length} styles {params.get('q') && `· “${params.get('q')}” 검색 결과`}
        </span>
        <div className="filter-chips">
          {applied.map((k) => (
            <button key={k} onClick={() => set(k, '')}>
              {k === 'max' ? `${money(Number(params.get(k)))} 이하` : params.get(k)}
              <X size={12} />
            </button>
          ))}
          {applied.length > 0 && (
            <button
              onClick={() => {
                const next = new URLSearchParams(params);
                applied.forEach((k) => next.delete(k));
                router.replace(`/${mode}?${next}`, { scroll: false });
              }}
            >
              초기화
            </button>
          )}
        </div>
      </div>
      {products.length ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <Empty
          title={
            mode === 'wishlist' ? '아직 찜한 상품이 없습니다.' : '조건에 맞는 상품이 없습니다.'
          }
          description="다른 스타일도 천천히 둘러보세요."
        />
      )}
      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen} title="Filter styles">
        {controls}
        <button className="button full" onClick={() => setFiltersOpen(false)}>
          {products.length}개 상품 보기
        </button>
      </Drawer>
    </section>
  );
}
export function ProductDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const { catalog, ready, toast } = useCatalog(),
    product = catalog.products.find((p) => p.slug === slug),
    [color, setColor] = useState(''),
    [size, setSize] = useState(''),
    [error, setError] = useState('');
  const add = useShop((s) => s.add),
    toggle = useShop((s) => s.toggle),
    wishlist = useShop((s) => s.wishlist);
  if (!product)
    return (
      <section className="section">
        <Empty
          title={ready ? '상품을 찾을 수 없습니다.' : '상품을 불러오는 중입니다.'}
          description="상품이 삭제되었거나 주소가 변경되었을 수 있습니다."
        />
      </section>
    );
  const selectOptions = () => {
    if (!product.colors.includes(color) || !product.sizes.includes(size)) {
      setError(!product.colors.includes(color) ? '색상을 선택해주세요.' : '사이즈를 선택해주세요.');
      document.getElementById('product-options')?.scrollIntoView({ block: 'center' });
      return false;
    }
    setError('');
    return true;
  };
  const addToCart = () => {
    if (!selectOptions()) return;
    add({ productId: product.id, color, size });
    toast('장바구니에 담았습니다.');
    router.push('/cart');
  };
  const buyNow = () => {
    if (!selectOptions()) return;
    const params = new URLSearchParams({ product: product.id, color, size });
    router.push(`/checkout-demo?${params}`);
  };
  return (
    <section className="product-detail">
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={`/${product.gender}`}>{product.gender === 'women' ? 'Women' : 'Men'}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <div className="detail-layout">
        <div className="gallery" tabIndex={0} role="region" aria-label="상품 이미지 갤러리">
          {product.images.map((src, i) => (
            <div className="gallery-image" key={`${src}-${i}`}>
              <Photo
                src={src}
                alt={`${product.name} ${i + 1}번 착용 이미지`}
                priority={i === 0}
                sizes="(max-width: 600px) 100vw, 55vw"
              />
            </div>
          ))}
          {product.images.length === 1 && (
            <figure
              className={`gallery-image zoom-view ${['하의', '팬츠'].includes(product.category) ? 'lower-detail' : ''}`}
            >
              <Photo src={product.images[0]} alt={`${product.name} 원본 착용컷 확대 보조 뷰`} />
              <figcaption>착용컷 확대 보기</figcaption>
            </figure>
          )}
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {product.isNew ? 'NEW COLLECTION' : 'THE EONVE COLLECTION'}
          </span>
          <h1>{product.name}</h1>
          <p className="detail-price">{money(product.price)}</p>
          <p className="detail-description">{product.description}</p>
          <fieldset id="product-options">
            <legend>
              색상 <span>{color}</span>
            </legend>
            <div className="color-options">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setError('');
                  }}
                  className={color === c ? 'chosen' : ''}
                  style={{ background: colors[c] ?? c }}
                  aria-label={`색상 ${c}`}
                  aria-pressed={color === c}
                >
                  {color === c && <Check size={16} />}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              사이즈 <span>{size || '옵션을 선택하세요'}</span>
            </legend>
            <div className="size-options">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={size === s ? 'chosen' : ''}
                  onClick={() => {
                    setSize(s);
                    setError('');
                  }}
                  aria-pressed={size === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <div className="purchase-actions">
            <button className="button secondary add-to-cart" onClick={addToCart}>
              장바구니 담기 <ShoppingBag size={17} />
            </button>
            <button className="button buy-now" onClick={buyNow}>
              바로 구매 <ArrowRight size={17} />
            </button>
            <button
              className="button secondary detail-wish"
              aria-label="상품 찜하기"
              aria-pressed={wishlist.includes(product.id)}
              onClick={() => {
                toggle(product.id);
                toast(
                  wishlist.includes(product.id)
                    ? '찜 목록에서 삭제했습니다.'
                    : '찜 목록에 담았습니다.',
                );
              }}
            >
              <Heart size={20} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <details open>
            <summary>소재 및 관리</summary>
            <p>
              {product.material}
              <br />
              소재의 형태를 유지하기 위해 전문 세탁을 권장합니다.
            </p>
          </details>
          <details>
            <summary>사이즈 안내</summary>
            <p>
              XS 44 / S 55 / M 66 / L 77 / XL 88
              <br />
              가상 상품의 데모 옵션이며 실제 치수 정보가 아닙니다.
            </p>
          </details>
          <details>
            <summary>포트폴리오 상품 안내</summary>
            <p>AI로 제작한 가상 의류입니다. 실제 판매·배송·결제가 이루어지지 않습니다.</p>
          </details>
        </div>
      </div>
      <div className="related">
        <SectionHeading
          eyebrow="COMPLETE YOUR WARDROBE"
          title="You may also like"
          href={`/${product.gender}`}
        />
        <div className="product-grid">
          {catalog.products
            .filter((p) => p.gender === product.gender && p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </div>
    </section>
  );
}
export function Empty({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty">
      <ShoppingBag strokeWidth={1} size={40} />
      <h2>{title}</h2>
      <p>{description}</p>
      <Link href="/new" className="button">
        컬렉션 둘러보기 <ArrowRight size={16} />
      </Link>
    </div>
  );
}
export function Cart() {
  const { catalog, toast } = useCatalog(),
    shop = useShop(),
    router = useRouter(),
    totals = cartTotals(shop.cart, catalog.products),
    available = shop.cart.filter((l) =>
      catalog.products.some(
        (p) => p.id === l.productId && p.colors.includes(l.color) && p.sizes.includes(l.size),
      ),
    ),
    invalid = shop.cart.filter((l) => !available.includes(l));
  return (
    <section className="section">
      <div className="page-heading">
        <span className="eyebrow">YOUR SELECTION</span>
        <h1>Shopping bag</h1>
        <p>마음에 드는 옷, 나만의 일상으로.</p>
      </div>
      {shop.cart.length ? (
        <div className="cart-layout">
          <div>
            {invalid.length > 0 && (
              <div className="notice" role="alert">
                판매 옵션이 변경된 상품 {invalid.length}개가 있습니다. 삭제 후 다시 담아주세요.
                {invalid.map((l) => (
                  <button
                    key={lineKey(l)}
                    className="text-link"
                    onClick={() => shop.remove(lineKey(l))}
                  >
                    사용할 수 없는 상품 삭제
                  </button>
                ))}
              </div>
            )}
            {available.map((l) => {
              const p = catalog.products.find((p) => p.id === l.productId)!;
              return (
                <article key={lineKey(l)} className="cart-line">
                  <Link href={`/products/${p.slug}`} className="cart-photo">
                    <Photo src={p.images[0]} alt={p.name} />
                  </Link>
                  <div className="cart-line-info">
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                    <p>
                      {l.color} / {l.size}
                    </p>
                    <div className="quantity">
                      <button
                        className="icon-button"
                        aria-label={`${p.name} 수량 줄이기`}
                        disabled={l.quantity === 1}
                        onClick={() => shop.quantity(lineKey(l), l.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{l.quantity}</span>
                      <button
                        className="icon-button"
                        aria-label={`${p.name} 수량 늘리기`}
                        disabled={l.quantity === 99}
                        onClick={() => shop.quantity(lineKey(l), l.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-line-price">
                    <button
                      className="icon-button"
                      aria-label={`${p.name} 삭제`}
                      onClick={() => {
                        shop.remove(lineKey(l));
                        toast('장바구니에서 삭제했습니다.');
                      }}
                    >
                      <X size={17} />
                    </button>
                    <span>{money(p.price * l.quantity)}</span>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div>
              <span>상품 수량</span>
              <span>{totals.count}개</span>
            </div>
            <div>
              <span>상품 합계</span>
              <span>{money(totals.total)}</span>
            </div>
            <div className="cart-total">
              <span>총 금액</span>
              <strong>{money(totals.total)}</strong>
            </div>
            <button
              className="button full"
              disabled={!!invalid.length || !available.length}
              onClick={() => router.push('/checkout-demo?from=cart')}
            >
              모의 주문하기 <ArrowRight size={16} />
            </button>
            <p className="muted">
              결제 정보 입력 없이 주문 흐름을 체험합니다.
              <br />
              실제 결제나 배송은 발생하지 않습니다.
            </p>
          </aside>
        </div>
      ) : (
        <Empty
          title="장바구니가 비어 있습니다."
          description="당신의 일상에 어울리는 스타일을 찾아보세요."
        />
      )}
    </section>
  );
}
export function Checkout() {
  const shop = useShop(),
    order = shop.lastOrder,
    { catalog } = useCatalog(),
    params = useSearchParams(),
    router = useRouter();
  const productId = params.get('product');
  const review = params.get('from') === 'cart' || productId !== null;
  const lines =
    productId !== null
      ? [
          {
            productId,
            color: params.get('color') ?? '',
            size: params.get('size') ?? '',
            quantity: 1,
          },
        ]
      : shop.cart;
  const valid =
    lines.length > 0 &&
    lines.every((line) =>
      catalog.products.some(
        (p) =>
          p.id === line.productId && p.colors.includes(line.color) && p.sizes.includes(line.size),
      ),
    );
  const totals = cartTotals(lines, catalog.products);
  if (review)
    return (
      <section className="section order-review">
        <div className="page-heading">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h1>주문 확인</h1>
          <p>선택한 상품과 옵션을 확인해주세요.</p>
        </div>
        {valid ? (
          <div className="cart-layout">
            <div>
              {lines.map((line) => {
                const p = catalog.products.find((p) => p.id === line.productId)!;
                return (
                  <article className="cart-line" key={lineKey(line)}>
                    <Link href={`/products/${p.slug}`} className="cart-photo">
                      <Photo src={p.images[0]} alt={p.name} />
                    </Link>
                    <div className="cart-line-info">
                      <Link href={`/products/${p.slug}`}>{p.name}</Link>
                      <p>
                        {line.color} / {line.size} · {line.quantity}개
                      </p>
                      <span>{money(p.price * line.quantity)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
            <aside className="cart-summary">
              <h2>Order summary</h2>
              <div>
                <span>상품 수량</span>
                <span>{totals.count}개</span>
              </div>
              <div className="cart-total">
                <span>총 금액</span>
                <strong>{money(totals.total)}</strong>
              </div>
              <button
                className="button full"
                onClick={() => {
                  shop.checkout(totals.total, totals.count, productId === null);
                  router.replace('/checkout-demo');
                }}
              >
                모의 주문 확정 <ArrowRight size={16} />
              </button>
              <p className="muted">실제 결제나 배송 없이 구매 과정을 체험합니다.</p>
              <Link
                className="text-link"
                href={
                  productId
                    ? `/products/${catalog.products.find((p) => p.id === productId)!.slug}`
                    : '/cart'
                }
              >
                선택 수정하기
              </Link>
            </aside>
          </div>
        ) : (
          <Empty
            title="주문할 상품을 확인해주세요."
            description="상품이나 옵션이 변경되었습니다. 다시 선택해주세요."
          />
        )}
      </section>
    );
  return (
    <section className="section">
      <div className="checkout-complete">
        <span className="check-circle">
          <Check size={28} />
        </span>
        <span className="eyebrow">EONVE DEMO EXPERIENCE</span>
        <h1>{order ? 'Thank you.' : 'Your next chapter.'}</h1>
        <p>
          {order
            ? '모의 주문이 완료되었습니다. 실제 결제는 이루어지지 않았습니다.'
            : '장바구니에서 모의 주문을 체험해보세요.'}
        </p>
        {order && (
          <dl>
            <div>
              <dt>데모 주문번호</dt>
              <dd>{order.number}</dd>
            </div>
            <div>
              <dt>상품 수량</dt>
              <dd>{order.count}개</dd>
            </div>
            <div>
              <dt>가상 총액</dt>
              <dd>{money(order.total)}</dd>
            </div>
          </dl>
        )}
        <Link href="/" className="button">
          홈으로 돌아가기 <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
