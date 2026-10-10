import { test, expect } from '@playwright/test';
test('MEN·NEW 탐색, 필터 해제와 키보드 포커스', async ({ page }) => {
  await page.goto('/men');
  await expect(page.locator('.product-card')).toHaveCount(12);
  await page.getByRole('button', { name: '니트', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(3);
  await expect(page).toHaveURL(/category=/);
  const filter = page.getByRole('button', { name: /필터/ });
  await filter.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(filter).toBeFocused();
  await page.getByRole('button', { name: '전체', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(12);
  await page.goto('/new');
  await expect(page.locator('.product-card')).toHaveCount(8);
});
test('카테고리 CRUD 및 연결 상품 이름 동기화', async ({ page }) => {
  await page.goto('/admin/categories');
  await page.getByLabel('카테고리명', { exact: true }).fill('테스트 분류');
  await page.getByRole('button', { name: '카테고리 추가' }).click();
  await expect(page.getByRole('cell', { name: '테스트 분류', exact: true })).toBeVisible();
  await page.goto('/admin/products/new');
  await page.getByLabel('상품명', { exact: true }).fill('Category Test Coat');
  await page.getByLabel('URL slug').fill('category-test-coat');
  await page.getByLabel('상품 설명', { exact: true }).fill('카테고리 연결 테스트용 상품입니다.');
  await page.getByLabel('소재', { exact: true }).fill('울 100%');
  await page.getByRole('combobox', { name: '카테고리', exact: true }).selectOption('테스트 분류');
  await page.getByRole('button', { name: '상품 저장' }).click();
  await expect(page.getByRole('link', { name: 'Category Test Coat', exact: true })).toBeVisible();
  await page.goto('/admin/categories');
  await page.getByRole('button', { name: 'women 테스트 분류 수정', exact: true }).click();
  await page.getByLabel('카테고리명', { exact: true }).fill('수정된 분류');
  await page.getByRole('button', { name: '수정 저장' }).click();
  await expect(page.getByRole('cell', { name: '수정된 분류', exact: true })).toBeVisible();
  await page.goto('/women?category=' + encodeURIComponent('수정된 분류'));
  await expect(page.getByRole('link', { name: 'Category Test Coat', exact: true })).toBeVisible();
  await page.goto('/admin/products');
  await page.getByRole('button', { name: 'Category Test Coat 삭제', exact: true }).click();
  await page.getByRole('button', { name: '삭제 확인' }).click();
  await expect(page.getByRole('link', { name: 'Category Test Coat', exact: true })).toHaveCount(0);
  await page.goto('/admin/categories');
  await page.getByRole('button', { name: 'women 수정된 분류 삭제', exact: true }).click();
  await page.getByRole('button', { name: '삭제 확인' }).click();
  await expect(page.getByRole('cell', { name: '수정된 분류', exact: true })).toHaveCount(0);
});
test('320·768·1024·1440 폭에서 고객·관리자 화면 넘침 없음', async ({ page }) => {
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/women', '/products/sculpted-wool-coat', '/cart', '/admin']) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${width} ${route}`,
      ).toBe(true);
    }
  }
});
test('쇼핑·옵션 검증·찜·장바구니 유지·모의 주문', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The art of everyday.' })).toBeVisible();
  if (isMobile) {
    await page.getByRole('button', { name: '메뉴 열기' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'WOMEN' }).click();
  } else
    await page
      .getByRole('navigation', { name: '주요 메뉴' })
      .getByRole('link', { name: 'WOMEN' })
      .click();
  await expect(page.getByRole('heading', { name: 'Women', exact: true })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(12);
  await page.getByRole('link', { name: 'Sculpted Wool Coat 상품 상세' }).click();
  await page.getByRole('button', { name: '장바구니 담기' }).click();
  await expect(page.getByRole('alert').filter({ hasText: '색상을 선택해주세요.' })).toBeVisible();
  await page.getByRole('button', { name: '색상 Sand', exact: true }).click();
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: '상품 찜하기', exact: true }).click();
  await page.getByRole('button', { name: '장바구니 담기' }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.locator('.cart-total')).toContainText('₩249,000');
  await page.getByRole('button', { name: 'Sculpted Wool Coat 수량 늘리기' }).click();
  await expect(page.locator('.cart-total')).toContainText('₩498,000');
  await page.reload();
  await expect(page.locator('.cart-total')).toContainText('₩498,000');
  await page.goto('/wishlist');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.goto('/cart');
  await page.getByRole('button', { name: '모의 주문하기' }).click();
  await expect(page.getByRole('heading', { name: '주문 확인', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '모의 주문 확정' }).click();
  await expect(page.getByRole('heading', { name: 'Thank you.' })).toBeVisible();
  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: '장바구니가 비어 있습니다.' })).toBeVisible();
});

test('플로팅 메뉴·하트·바로 구매는 기존 장바구니를 유지한다', async ({ page }) => {
  await page.goto('/women');
  const quick = page.getByRole('navigation', { name: '쇼핑 바로가기' });
  await expect(quick).toBeVisible();
  await page.getByRole('button', { name: 'Sculpted Wool Coat 찜하기', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Sculpted Wool Coat 찜 해제', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await quick.getByRole('link', { name: '위시리스트 바로가기 1개', exact: true }).click();
  await expect(page.getByRole('heading', { name: '위시리스트', exact: true })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Sculpted Wool Coat 상품 상세' }).click();
  await page.getByRole('button', { name: '바로 구매' }).click();
  await expect(page.getByRole('alert').filter({ hasText: '색상을 선택해주세요.' })).toBeVisible();
  await page.getByRole('button', { name: '색상 Sand', exact: true }).click();
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: '장바구니 담기' }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await page
    .locator('.cart-line-info')
    .getByRole('link', { name: 'Sculpted Wool Coat', exact: true })
    .click();
  await page.getByRole('button', { name: '색상 Sand', exact: true }).click();
  await page.getByRole('button', { name: 'S', exact: true }).click();
  await page.getByRole('button', { name: '바로 구매' }).click();
  await expect(page.getByRole('heading', { name: '주문 확인', exact: true })).toBeVisible();
  await expect(page.locator('.order-review .cart-line-info')).toContainText('Sand / S · 1개');
  await page.reload();
  await expect(page.locator('.order-review .cart-line-info')).toContainText('Sand / S · 1개');
  await page.getByRole('button', { name: '모의 주문 확정' }).click();
  await expect(page.getByRole('heading', { name: 'Thank you.' })).toBeVisible();
  await quick.getByRole('link', { name: '장바구니 바로가기 1개', exact: true }).click();
  await expect(page.locator('.cart-line-info')).toContainText('Sand / M');
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await quick.getByRole('button', { name: '맨 위로', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await quick.getByRole('link', { name: '위시리스트 바로가기 1개', exact: true }).click();
  await expect(page.getByRole('heading', { name: '위시리스트', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Sculpted Wool Coat 찜 해제', exact: true }).click();
  await expect(page.getByRole('heading', { name: '아직 찜한 상품이 없습니다.' })).toBeVisible();
});
test('검색·URL 필터·정렬·화면 넘침 없음', async ({ page }) => {
  await page.goto('/search?q=wool');
  await expect(page.locator('.product-card')).toHaveCount(4);
  await page.selectOption('#sort', 'price-asc');
  await expect(page).toHaveURL(/sort=price-asc/);
  await page.getByRole('button', { name: '필터', exact: true }).click();
  await page.getByRole('dialog').getByLabel('색상').selectOption('Sand');
  await page.getByRole('button', { name: '3개 상품 보기' }).click();
  await expect(page.locator('.product-card')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.reload();
  await expect(page.locator('.product-card')).toHaveCount(3);
});
test('관리자 상품 CRUD·고객 반영·카테고리 보호·배너·초기화', async ({ page }) => {
  await page.goto('/admin/products/new');
  await page.getByLabel('상품명', { exact: true }).fill('Test Linen Jacket');
  await page.getByLabel('URL slug').fill('test-linen-jacket');
  await page.getByLabel('상품 설명', { exact: true }).fill('테스트 상품의 충분한 설명입니다.');
  await page.getByLabel('소재', { exact: true }).fill('린넨 100%');
  await page.getByRole('button', { name: '상품 저장' }).click();
  await expect(page.getByRole('link', { name: 'Test Linen Jacket', exact: true })).toBeVisible();
  await page.goto('/products/test-linen-jacket');
  await expect(page.getByRole('heading', { name: 'Test Linen Jacket', exact: true })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Test Linen Jacket', exact: true })).toBeVisible();
  await page.goto('/admin/products');
  await page.getByRole('link', { name: 'Test Linen Jacket 수정' }).click();
  await page.getByLabel('상품명', { exact: true }).fill('Updated Linen Jacket');
  await page.getByRole('button', { name: '상품 저장' }).click();
  await expect(page.getByRole('link', { name: 'Updated Linen Jacket', exact: true })).toBeVisible();
  await page.goto('/women');
  await expect(page.getByRole('link', { name: 'Updated Linen Jacket', exact: true })).toBeVisible();
  await page.goto('/admin/categories');
  await page.getByRole('button', { name: 'women 아우터 삭제', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('연결된 상품');
  await page.goto('/admin/content');
  await page.getByRole('textbox', { name: '배너 제목', exact: true }).fill('A new chapter.');
  await page.getByRole('button', { name: '콘텐츠 저장' }).click();
  await expect(page.getByRole('status')).toContainText('저장');
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A new chapter.' })).toBeVisible();
  await page.goto('/admin/products');
  await page.getByRole('button', { name: 'Updated Linen Jacket 삭제' }).click();
  await page.getByRole('button', { name: '삭제 확인' }).click();
  await expect(page.getByRole('link', { name: 'Updated Linen Jacket', exact: true })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: '데모 초기화' }).click();
  await page.getByRole('button', { name: '초기화 확인' }).click();
  await expect(page.getByRole('status')).toContainText('데모 데이터를 초기화했습니다.');
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The art of everyday.' })).toBeVisible();
});
test('데스크톱·모바일 페이지 스크린샷', async ({ page }, info) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page
    .getByRole('img', {
      name: '샌드 코트와 올리브 셔츠로 완성한 EONVE 가을 컬렉션 화보',
      exact: true,
    })
    .evaluate(async (img) => {
      if (img instanceof HTMLImageElement) await img.decode();
    });
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(70);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `docs/screenshots/home-${info.project.name}.png`,
    fullPage: true,
  });
});
