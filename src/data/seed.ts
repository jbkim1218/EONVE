import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, '영문 소문자·숫자·하이픈을 사용하세요.'),
  name: z.string().trim().min(2, '상품명을 2자 이상 입력하세요.'),
  gender: z.enum(['men', 'women']),
  category: z.string().min(1),
  price: z.number().int().positive('가격은 0보다 커야 합니다.'),
  description: z.string().min(5),
  material: z.string().min(2),
  colors: z.array(z.string().min(1)).min(1),
  sizes: z.array(z.string().min(1)).min(1),
  images: z
    .array(
      z.string().regex(/^(\/images\/|https:\/\/)/, '로컬 이미지 경로 또는 HTTPS URL을 입력하세요.'),
    )
    .min(1),
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});
export type Product = z.infer<typeof productSchema>;
export type Category = { id: string; name: string; gender: 'men' | 'women' };
export type Content = {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  eyebrow: string;
};
export type Catalog = { products: Product[]; categories: Category[]; content: Content };
export const colors: Record<string, string> = {
  Sand: '#c2ae92',
  Ink: '#242321',
  Olive: '#737966',
  Ivory: '#f1eee5',
  Wine: '#733f4d',
  Charcoal: '#555451',
  Indigo: '#37475f',
};
export const seedCategories: Category[] = [
  ...['아우터', '상의', '하의', '원피스'].map((name, i) => ({
    id: `wcat${i}`,
    name,
    gender: 'women' as const,
  })),
  ...['아우터', '상의', '니트', '팬츠'].map((name, i) => ({
    id: `mcat${i}`,
    name,
    gender: 'men' as const,
  })),
];
const rows: [string, string, string, number, string, string][] = [
  ['w01', 'Sculpted Wool Coat', '아우터', 249000, 'Sand', '울 80%, 나일론 20%'],
  ['w02', 'Cropped Leather Jacket', '아우터', 289000, 'Ink', '합성 가죽 100%'],
  ['w03', 'Fluid Trench Coat', '아우터', 219000, 'Olive', '면 70%, 나일론 30%'],
  ['w04', 'Essential Poplin Shirt', '상의', 89000, 'Ivory', '면 100%'],
  ['w05', 'Draped Satin Blouse', '상의', 99000, 'Wine', '폴리에스터 100%'],
  ['w06', 'Soft Ribbed Top', '상의', 59000, 'Ivory', '면 95%, 스판 5%'],
  ['w07', 'Wide Tailored Trousers', '하의', 129000, 'Charcoal', '폴리에스터 65%, 레이온 35%'],
  ['w08', 'Pleated Midi Skirt', '하의', 119000, 'Sand', '폴리에스터 100%'],
  ['w09', 'Straight Denim', '하의', 109000, 'Indigo', '면 100%'],
  ['w10', 'Column Maxi Dress', '원피스', 169000, 'Ink', '레이온 70%, 폴리에스터 30%'],
  ['w11', 'Rib Knit Dress', '원피스', 149000, 'Olive', '면 55%, 아크릴 45%'],
  ['w12', 'Fluid Long Dress', '원피스', 189000, 'Wine', '폴리에스터 100%'],
  ['m01', 'Wool Tailored Coat', '아우터', 269000, 'Sand', '울 80%, 나일론 20%'],
  ['m02', 'Structured Overshirt', '아우터', 159000, 'Olive', '면 100%'],
  ['m03', 'Cropped Zip Jacket', '아우터', 179000, 'Charcoal', '폴리에스터 65%, 면 35%'],
  ['m04', 'Relaxed Poplin Shirt', '상의', 89000, 'Ivory', '면 100%'],
  ['m05', 'Everyday Cotton Tee', '상의', 49000, 'Ink', '면 100%'],
  ['m06', 'Soft Long Sleeve Shirt', '상의', 99000, 'Wine', '면 100%'],
  ['m07', 'Textured Wool Knit', '니트', 139000, 'Sand', '울 80%, 나일론 20%'],
  ['m08', 'Fine Knit Cardigan', '니트', 129000, 'Olive', '면 55%, 아크릴 45%'],
  ['m09', 'Merino Turtleneck', '니트', 119000, 'Charcoal', '메리노 울 100%'],
  ['m10', 'Wide Wool Trousers', '팬츠', 139000, 'Ink', '울 50%, 폴리에스터 50%'],
  ['m11', 'Cotton Straight Trousers', '팬츠', 99000, 'Sand', '면 100%'],
  ['m12', 'Relaxed Denim', '팬츠', 119000, 'Indigo', '면 100%'],
];
export const seedProducts: Product[] = rows.map(
  ([id, name, category, price, color, material], i) => ({
    id,
    slug: name.toLowerCase().replaceAll(' ', '-'),
    name,
    gender: id[0] === 'w' ? 'women' : 'men',
    category,
    price,
    description:
      '자연스러운 실루엣과 섬세한 소재의 균형. 일상의 움직임을 따라 흐르는 여유로운 핏으로, 오래 함께할 수 있는 스타일을 제안합니다.',
    material,
    colors: [color],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [`/images/${id}.png`],
    isNew: i % 3 === 0,
    isFeatured: [0, 4, 10, 13, 18, 22].includes(i),
    createdAt: `2026-09-${String(28 - i).padStart(2, '0')}T00:00:00.000Z`,
  }),
);
export const seedCatalog: Catalog = {
  products: seedProducts,
  categories: seedCategories,
  content: {
    title: 'The art of\neveryday.',
    subtitle: '일상을 새롭게 바라보는 시선.\n자연스러운 실루엣, 오래 머무는 아름다움.',
    image: '/images/hero.png',
    link: '/new',
    eyebrow: 'AUTUMN / WINTER 2026',
  },
};
