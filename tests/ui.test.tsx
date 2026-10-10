import React from 'react';
import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Empty } from '@/features/storefront';
it('빈 장바구니 상태에서 컬렉션 탐색을 제공한다', () => {
  render(<Empty title="장바구니가 비어 있습니다." description="스타일을 찾아보세요." />);
  expect(screen.getByRole('heading', { name: '장바구니가 비어 있습니다.' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /컬렉션 둘러보기/ })).toHaveAttribute('href', '/new');
});
