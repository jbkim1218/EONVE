import type { Product } from '@/data/seed';
export type Filters = {
  q?: string;
  gender?: string;
  category?: string;
  color?: string;
  size?: string;
  max?: number;
  sort?: string;
  onlyNew?: boolean;
};
export function filterProducts(products: Product[], f: Filters) {
  const result = products.filter(
    (p) =>
      (!f.q ||
        `${p.name} ${p.category} ${p.description}`
          .toLowerCase()
          .includes(f.q.toLowerCase().trim())) &&
      (!f.gender || p.gender === f.gender) &&
      (!f.category || p.category === f.category) &&
      (!f.color || p.colors.includes(f.color)) &&
      (!f.size || p.sizes.includes(f.size)) &&
      (!f.max || p.price <= f.max) &&
      (!f.onlyNew || p.isNew),
  );
  return result.sort((a, b) =>
    f.sort === 'price-asc'
      ? a.price - b.price
      : f.sort === 'price-desc'
        ? b.price - a.price
        : b.createdAt.localeCompare(a.createdAt),
  );
}
export type CartLine = { productId: string; color: string; size: string; quantity: number };
export function lineKey(l: Omit<CartLine, 'quantity'>) {
  return `${l.productId}:${l.color}:${l.size}`;
}
export function addLine(cart: CartLine[], line: Omit<CartLine, 'quantity'>) {
  const found = cart.some((l) => lineKey(l) === lineKey(line));
  return found
    ? cart.map((l) =>
        lineKey(l) === lineKey(line) ? { ...l, quantity: Math.min(99, l.quantity + 1) } : l,
      )
    : [...cart, { ...line, quantity: 1 }];
}
export function cartTotals(cart: CartLine[], products: Product[]) {
  return cart.reduce(
    (s, l) => {
      const p = products.find((p) => p.id === l.productId);
      return p ? { count: s.count + l.quantity, total: s.total + p.price * l.quantity } : s;
    },
    { count: 0, total: 0 },
  );
}
export function toggleId(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((v) => v !== id) : [...ids, id];
}
export const money = (n: number) => `₩${n.toLocaleString('ko-KR')}`;
