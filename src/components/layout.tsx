'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, Search, Heart, ShoppingBag, ArrowUp, ArrowUpRight } from 'lucide-react';
import { useShop } from '@/lib/store';
import { Drawer } from './ui';
export function Logo() {
  return (
    <Image
      src="/images/eonve-logo.png"
      width={2172}
      height={724}
      alt="EONVE"
      priority
      className="logo"
    />
  );
}
export function Header() {
  const pathname = usePathname(),
    router = useRouter(),
    [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [q, setQ] = useState('');
  const cart = useShop((s) => s.cart),
    count = cart.reduce((sum, l) => sum + l.quantity, 0);
  return (
    <>
      <header className="header">
        <button
          className="icon-button mobile-menu"
          aria-label="메뉴 열기"
          onClick={() => setMenu(true)}
        >
          <Menu size={23} />
        </button>
        <Link className="brand" href="/" aria-label="EONVE 홈">
          <Logo />
        </Link>
        <nav className="main-nav" aria-label="주요 메뉴">
          {[
            ['/women', 'WOMEN'],
            ['/men', 'MEN'],
            ['/new', 'NEW'],
          ].map(([url, text]) => (
            <Link key={url} href={url} className={pathname === url ? 'active' : ''}>
              {text}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="검색 열기" onClick={() => setSearch(true)}>
            <Search size={21} />
          </button>
          <Link className="icon-button desktop-wish" href="/wishlist" aria-label="찜 목록">
            <Heart size={21} />
          </Link>
          <Link className="icon-button cart-icon" href="/cart" aria-label={`장바구니 ${count}개`}>
            <ShoppingBag size={21} />
            {count > 0 && <span className="count">{count}</span>}
          </Link>
        </div>
      </header>
      <Drawer open={menu} onOpenChange={setMenu} title="EONVE">
        <nav className="mobile-links">
          {[
            ['/women', 'WOMEN'],
            ['/men', 'MEN'],
            ['/new', 'NEW'],
            ['/wishlist', '찜 목록'],
          ].map(([url, text]) => (
            <Link key={url} href={url} onClick={() => setMenu(false)}>
              {text}
              <ArrowUpRight size={22} />
            </Link>
          ))}
        </nav>
      </Drawer>
      <Drawer open={search} onOpenChange={setSearch} title="Search">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(false);
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
          className="search-form"
        >
          <label htmlFor="header-search">찾고 있는 스타일이 있나요?</label>
          <div>
            <input
              id="header-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="상품명 또는 카테고리"
              autoFocus
            />
            <button className="icon-button" type="submit" aria-label="검색">
              <Search />
            </button>
          </div>
        </form>
        <p className="muted">Sculpted Wool Coat · Essential Poplin Shirt · Denim</p>
      </Drawer>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link href="/" aria-label="EONVE 홈">
          <Logo />
        </Link>
        <p>
          Beautiful by Design.
          <br />
          Effortless by Nature.
        </p>
        <span className="muted">일상에 스며드는, 오래 머무는 아름다움.</span>
      </div>
      <div className="footer-links">
        <div>
          <span>EXPLORE</span>
          <Link href="/women">Women</Link>
          <Link href="/men">Men</Link>
          <Link href="/new">New arrivals</Link>
        </div>
        <div>
          <span>YOUR EONVE</span>
          <Link href="/wishlist">찜 목록</Link>
          <Link href="/cart">장바구니</Link>
          <Link href="/admin">
            관리자 데모 <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 EONVE. All rights reserved.</span>
        <span>포트폴리오 데모 · 실제 판매 및 결제가 이루어지지 않습니다.</span>
      </div>
    </footer>
  );
}
export function FloatingSidebar() {
  const path = usePathname();
  const count = useShop((s) => s.cart.reduce((sum, line) => sum + line.quantity, 0));
  const wished = useShop((s) => s.wishlist.length);
  return (
    <nav
      className={`floating-sidebar ${path.startsWith('/products/') ? 'on-product' : ''}`}
      aria-label="쇼핑 바로가기"
    >
      <Link
        href="/cart"
        aria-label={`장바구니 바로가기 ${count}개`}
        aria-current={path === '/cart' ? 'page' : undefined}
      >
        <span className="floating-icon">
          <ShoppingBag size={20} />
          {count > 0 && <span className="floating-count">{count}</span>}
        </span>
        <span>장바구니</span>
      </Link>
      <Link
        href="/wishlist"
        aria-label={`위시리스트 바로가기 ${wished}개`}
        aria-current={path === '/wishlist' ? 'page' : undefined}
      >
        <span className="floating-icon">
          <Heart size={20} />
          {wished > 0 && <span className="floating-count">{wished}</span>}
        </span>
        <span>위시리스트</span>
      </Link>
      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'instant'
              : 'smooth',
          })
        }
        aria-label="맨 위로"
      >
        <ArrowUp size={20} />
        <span>맨 위로</span>
      </button>
    </nav>
  );
}
