import { describe, it, expect } from 'vitest';
import { seedProducts, productSchema } from '@/data/seed';
import { filterProducts, addLine, lineKey, cartTotals, toggleId } from '@/lib/catalog';
describe('상품 탐색', () => {
  it('남녀 12개와 유효한 상품 24개를 제공한다', () => {
    expect(seedProducts).toHaveLength(24);
    expect(seedProducts.filter((p) => p.gender === 'women')).toHaveLength(12);
    seedProducts.forEach((p) => expect(productSchema.safeParse(p).success).toBe(true));
    expect(new Set(seedProducts.map((p) => p.slug)).size).toBe(24);
  });
  it('대소문자와 여백을 무시하여 검색한다', () => {
    expect(filterProducts(seedProducts, { q: '  WOOL  ' }).length).toBeGreaterThan(0);
    expect(filterProducts(seedProducts, { q: '없는상품' })).toEqual([]);
  });
  it('성별·카테고리·색상·사이즈·가격을 조합한다', () => {
    expect(
      filterProducts(seedProducts, {
        gender: 'women',
        category: '아우터',
        color: 'Sand',
        size: 'M',
        max: 250000,
      }),
    ).toEqual([seedProducts[0]]);
    expect(filterProducts(seedProducts, { size: 'XXL' })).toEqual([]);
  });
  it('가격과 등록일 순으로 정렬하며 원본을 보존한다', () => {
    const original = seedProducts.map((p) => p.id);
    for (const sort of ['price-asc', 'price-desc']) {
      const list = filterProducts(seedProducts, { sort });
      for (let i = 1; i < list.length; i++)
        expect(
          sort === 'price-asc'
            ? list[i].price >= list[i - 1].price
            : list[i].price <= list[i - 1].price,
        ).toBe(true);
    }
    expect(filterProducts(seedProducts, {})[0].id).toBe('w01');
    expect(seedProducts.map((p) => p.id)).toEqual(original);
  });
  it('필수 데이터와 음수 가격·잘못된 slug를 거부한다', () => {
    expect(productSchema.safeParse({ ...seedProducts[0], price: -1 }).success).toBe(false);
    expect(productSchema.safeParse({ ...seedProducts[0], sizes: [] }).success).toBe(false);
    expect(productSchema.safeParse({ ...seedProducts[0], slug: '잘못된 주소' }).success).toBe(
      false,
    );
  });
});
describe('장바구니와 찜', () => {
  const line = { productId: 'w01', color: 'Sand', size: 'M' };
  it('같은 옵션은 수량을 합치고 다른 옵션은 구분한다', () => {
    let cart = addLine([], line);
    cart = addLine(cart, line);
    cart = addLine(cart, { ...line, size: 'L' });
    expect(cart).toHaveLength(2);
    expect(cart[0].quantity).toBe(2);
    expect(lineKey(cart[0])).not.toBe(lineKey(cart[1]));
    expect(cartTotals(cart, seedProducts)).toEqual({ count: 3, total: 747000 });
  });
  it('삭제된 상품은 합계에서 제외한다', () => {
    expect(cartTotals([{ ...line, quantity: 1 }], [])).toEqual({ count: 0, total: 0 });
  });
  it('최대 수량을 99로 제한한다', () => {
    expect(addLine([{ ...line, quantity: 99 }], line)[0].quantity).toBe(99);
  });
  it('찜은 추가·해제하고 다른 찜을 보존한다', () => {
    expect(toggleId(['w02'], 'w01')).toEqual(['w02', 'w01']);
    expect(toggleId(['w02', 'w01'], 'w01')).toEqual(['w02']);
  });
});
