'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  LayoutDashboard,
  Package,
  Tags,
  PanelsTopLeft,
  ArrowUpRight,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { Logo } from '@/components/layout';
import { Drawer } from '@/components/ui';
import { useCatalog } from '@/components/providers';
import { productSchema, type Product, type Catalog, type Category } from '@/data/seed';
import { money } from '@/lib/catalog';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(),
    { reset, ready, toast } = useCatalog(),
    [confirm, setConfirm] = useState(false);
  const links = [
    ['/admin', 'Overview', LayoutDashboard],
    ['/admin/products', '상품 관리', Package],
    ['/admin/categories', '카테고리', Tags],
    ['/admin/content', '콘텐츠', PanelsTopLeft],
  ] as const;
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin">
          <Logo />
        </Link>
        <span className="admin-label">DEMO STUDIO</span>
        <nav aria-label="관리자 메뉴">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className={
                (href === '/admin' ? path === href : path.startsWith(href)) ? 'active' : ''
              }
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="admin-store">
          쇼핑몰 보기 <ArrowUpRight size={17} />
        </Link>
        <button className="reset-button" onClick={() => setConfirm(true)}>
          <RotateCcw size={16} />
          데모 초기화
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-top">
          <span>EONVE / BRAND STUDIO</span>
          <span className="demo-pill">브라우저 로컬 데모</span>
        </div>
        <p className="admin-notice">
          이 관리자 화면은 포트폴리오 체험용입니다. 변경사항은 현재 브라우저에만 저장됩니다.
        </p>
        {ready ? children : <p className="loading">저장된 상품을 불러오는 중입니다…</p>}
      </main>
      <Drawer open={confirm} onOpenChange={setConfirm} title="데모 데이터 초기화">
        <p>상품, 카테고리, 배너, 장바구니와 찜 목록을 기본 상태로 되돌립니다.</p>
        <button
          className="button full danger"
          onClick={async () => {
            try {
              await reset();
              setConfirm(false);
            } catch {
              toast('초기화하지 못했습니다.');
            }
          }}
        >
          초기화 확인
        </button>
        <button className="button full secondary" onClick={() => setConfirm(false)}>
          취소
        </button>
      </Drawer>
    </div>
  );
}
export function Dashboard() {
  const { catalog } = useCatalog();
  const stats = [
    ['전체 상품', catalog.products.length],
    ['여성복', catalog.products.filter((p) => p.gender === 'women').length],
    ['남성복', catalog.products.filter((p) => p.gender === 'men').length],
    ['카테고리', catalog.categories.length],
  ];
  return (
    <>
      <AdminTitle title="Overview" subtitle="브랜드의 다음 장을 준비하세요." />
      <div className="stat-grid">
        {stats.map(([label, n]) => (
          <div className="stat" key={label}>
            <span>{label}</span>
            <strong>{n}</strong>
            <span className="muted">LOCAL DEMO DATA</span>
          </div>
        ))}
      </div>
      <div className="admin-panel">
        <h2>최근 수정한 상품</h2>
        <ProductTable
          products={[...catalog.products]
            .sort((a, b) => (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt))
            .slice(0, 5)}
        />
      </div>
      <div className="admin-callout">
        <h2>Beautiful by Design.</h2>
        <p>상품과 콘텐츠의 변화가 고객 화면에 즉시 반영됩니다.</p>
        <Link href="/admin/products/new" className="button">
          새 상품 등록 <Plus size={16} />
        </Link>
      </div>
    </>
  );
}
function AdminTitle({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="admin-heading">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
function ProductTable({
  products,
  onDelete,
}: {
  products: Product[];
  onDelete?: (p: Product) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>상품</th>
            <th>구분</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <Link href={`/products/${p.slug}`}>{p.name}</Link>
                <small>{p.slug}</small>
              </td>
              <td>{p.gender === 'women' ? '여성' : '남성'}</td>
              <td>{p.category}</td>
              <td>{money(p.price)}</td>
              <td>
                <div className="table-actions">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    aria-label={`${p.name} 수정`}
                    className="icon-button"
                  >
                    <Pencil size={16} />
                  </Link>
                  {onDelete && (
                    <button
                      aria-label={`${p.name} 삭제`}
                      className="icon-button"
                      onClick={() => onDelete(p)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function AdminProducts() {
  const { catalog, save, toast } = useCatalog(),
    [q, setQ] = useState(''),
    [deleting, setDeleting] = useState<Product | null>(null);
  return (
    <>
      <AdminTitle title="Products" subtitle={`${catalog.products.length}개 상품을 관리합니다.`}>
        <Link className="button" href="/admin/products/new">
          <Plus size={16} />
          상품 등록
        </Link>
      </AdminTitle>
      <div className="admin-panel">
        <label className="sr-only" htmlFor="admin-q">
          상품 검색
        </label>
        <input
          id="admin-q"
          className="admin-search"
          placeholder="상품명 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <ProductTable
          products={catalog.products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))}
          onDelete={setDeleting}
        />
      </div>
      <Drawer
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="상품 삭제"
      >
        <p>“{deleting?.name}” 상품을 삭제할까요? 이 브라우저의 고객 화면에서도 삭제됩니다.</p>
        <button
          className="button full danger"
          onClick={async () => {
            try {
              await save({
                ...catalog,
                products: catalog.products.filter((p) => p.id !== deleting?.id),
              });
              setDeleting(null);
            } catch {
              toast('삭제하지 못했습니다.');
            }
          }}
        >
          삭제 확인
        </button>
        <button className="button full secondary" onClick={() => setDeleting(null)}>
          취소
        </button>
      </Drawer>
    </>
  );
}
const formSchema = productSchema.omit({ colors: true, sizes: true, images: true }).extend({
  colorsText: z.string().min(1, '색상을 입력하세요.'),
  sizesText: z.string().min(1, '사이즈를 입력하세요.'),
  imagesText: z.string().min(1, '이미지 경로를 입력하세요.'),
});
type ProductFormData = z.infer<typeof formSchema>;
function defaults(p?: Product): ProductFormData {
  return {
    id: p?.id ?? crypto.randomUUID(),
    slug: p?.slug ?? '',
    name: p?.name ?? '',
    gender: p?.gender ?? 'women',
    category: p?.category ?? '아우터',
    price: p?.price ?? 99000,
    description: p?.description ?? '',
    material: p?.material ?? '',
    colorsText: p?.colors.join(', ') ?? 'Sand',
    sizesText: p?.sizes.join(', ') ?? 'S, M, L',
    imagesText: p?.images.join('\n') ?? '/images/w01.png',
    isNew: p?.isNew ?? true,
    isFeatured: p?.isFeatured ?? false,
    createdAt: p?.createdAt ?? new Date().toISOString(),
  };
}
export function ProductEditor({ id }: { id?: string }) {
  const { catalog } = useCatalog(),
    p = id ? catalog.products.find((p) => p.id === id) : undefined;
  if (id && !p)
    return (
      <p>
        상품을 찾을 수 없습니다. <Link href="/admin/products">목록으로</Link>
      </p>
    );
  return <ProductEditorForm key={p?.id ?? 'new'} product={p} catalog={catalog} />;
}
function ProductEditorForm({ product, catalog }: { product?: Product; catalog: Catalog }) {
  const { save } = useCatalog(),
    router = useRouter(),
    [feedback, setFeedback] = useState('');
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults(product),
  });
  const gender = useWatch({ control, name: 'gender' });
  const submit = async (values: ProductFormData) => {
    const { colorsText, sizesText, imagesText, ...rest } = values;
    const result = productSchema.safeParse({
      ...rest,
      colors: colorsText
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      sizes: sizesText
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      images: imagesText
        .split('\n')
        .map((v) => v.trim())
        .filter(Boolean),
      updatedAt: new Date().toISOString(),
    });
    if (!result.success) {
      setFeedback(result.error.issues.map((e) => e.message).join(' '));
      return;
    }
    if (catalog.products.some((p) => p.slug === result.data.slug && p.id !== result.data.id)) {
      setFeedback('이미 사용 중인 slug입니다.');
      return;
    }
    if (
      !catalog.categories.some(
        (c) => c.gender === result.data.gender && c.name === result.data.category,
      )
    ) {
      setFeedback('선택한 성별의 카테고리를 선택하세요.');
      return;
    }
    try {
      await save({
        ...catalog,
        products: product
          ? catalog.products.map((p) => (p.id === product.id ? result.data : p))
          : [...catalog.products, result.data],
      });
      router.push('/admin/products');
    } catch {
      setFeedback('저장에 실패했습니다. 입력 내용은 유지됩니다.');
    }
  };
  const field = (name: keyof ProductFormData, label: string, type = 'text') => (
    <label className="form-field">
      {label}
      <input
        type={type}
        {...register(name, type === 'number' ? { valueAsNumber: true } : {})}
        aria-invalid={!!errors[name]}
      />
      {errors[name] && <span className="error">{errors[name]?.message}</span>}
    </label>
  );
  return (
    <>
      <AdminTitle
        title={product ? 'Edit product' : 'New product'}
        subtitle="상품의 기본 정보와 컬렉션 옵션을 설정하세요."
      />
      <form className="admin-form" onSubmit={handleSubmit(submit)}>
        <div className="form-grid">
          {field('name', '상품명')}
          {field('slug', 'URL slug')}
          {field('price', '가격 (원)', 'number')}
          <label className="form-field">
            성별
            <select {...register('gender')}>
              <option value="women">여성복</option>
              <option value="men">남성복</option>
            </select>
          </label>
          <label className="form-field">
            카테고리
            <select {...register('category')}>
              {catalog.categories
                .filter((c) => c.gender === gender)
                .map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
            </select>
          </label>
          {field('material', '소재')}
          {field('colorsText', '색상 (쉼표로 구분)')}
          {field('sizesText', '사이즈 (쉼표로 구분)')}
        </div>
        <label className="form-field">
          상품 설명
          <textarea rows={4} {...register('description')} aria-invalid={!!errors.description} />
          {errors.description && <span className="error">{errors.description.message}</span>}
        </label>
        <label className="form-field">
          이미지 경로 (한 줄에 하나)
          <textarea rows={3} {...register('imagesText')} />
          <small>/images/w01.png 등 로컬 이미지 또는 HTTPS URL</small>
        </label>
        <div className="checkbox-row">
          <label>
            <input type="checkbox" {...register('isNew')} />
            신상품
          </label>
          <label>
            <input type="checkbox" {...register('isFeatured')} />
            에디터 추천
          </label>
        </div>
        {feedback && (
          <p role="alert" className="error">
            {feedback}
          </p>
        )}
        <div className="form-actions">
          <Link href="/admin/products" className="button secondary">
            취소
          </Link>
          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? '저장 중…' : '상품 저장'}
          </button>
        </div>
      </form>
    </>
  );
}
export function AdminCategories() {
  const { catalog, save, toast } = useCatalog(),
    [editing, setEditing] = useState<Category | null>(null),
    [name, setName] = useState(''),
    [gender, setGender] = useState<'women' | 'men'>('women'),
    [deleting, setDeleting] = useState<Category | null>(null),
    [error, setError] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = name.trim();
    if (!value) {
      setError('카테고리명을 입력하세요.');
      return;
    }
    if (
      catalog.categories.some(
        (c) => c.id !== editing?.id && c.name === value && c.gender === gender,
      )
    ) {
      setError('이미 등록된 카테고리입니다.');
      return;
    }
    const used =
      editing &&
      catalog.products.some((p) => p.category === editing.name && p.gender === editing.gender);
    if (used && gender !== editing.gender) {
      setError('상품이 연결된 카테고리의 성별은 변경할 수 없습니다.');
      return;
    }
    const item = { id: editing?.id ?? crypto.randomUUID(), name: value, gender };
    try {
      await save({
        ...catalog,
        categories: editing
          ? catalog.categories.map((c) => (c.id === editing.id ? item : c))
          : [...catalog.categories, item],
        products: editing
          ? catalog.products.map((p) =>
              p.category === editing.name && p.gender === editing.gender
                ? { ...p, category: value }
                : p,
            )
          : catalog.products,
      });
      setEditing(null);
      setName('');
      setError('');
    } catch {
      setError('저장하지 못했습니다.');
    }
  };
  return (
    <>
      <AdminTitle title="Categories" subtitle="상품과 연결되는 카테고리를 관리하세요." />
      <form className="category-form admin-panel" onSubmit={submit}>
        <label>
          카테고리명
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          성별
          <select value={gender} onChange={(e) => setGender(e.target.value as 'women' | 'men')}>
            <option value="women">여성복</option>
            <option value="men">남성복</option>
          </select>
        </label>
        <button className="button" type="submit">
          {editing ? '수정 저장' : '카테고리 추가'}
        </button>
        {editing && (
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setEditing(null);
              setName('');
              setError('');
            }}
          >
            취소
          </button>
        )}
      </form>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="admin-panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>카테고리</th>
              <th>성별</th>
              <th>상품 수</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {catalog.categories.map((c) => {
              const count = catalog.products.filter(
                (p) => p.category === c.name && p.gender === c.gender,
              ).length;
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.gender === 'women' ? '여성복' : '남성복'}</td>
                  <td>{count}</td>
                  <td className="table-actions">
                    <button
                      className="icon-button"
                      aria-label={`${c.gender} ${c.name} 수정`}
                      onClick={() => {
                        setEditing(c);
                        setName(c.name);
                        setGender(c.gender);
                        setError('');
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="icon-button"
                      aria-label={`${c.gender} ${c.name} 삭제`}
                      onClick={() => {
                        if (count) {
                          toast('연결된 상품의 카테고리를 먼저 변경해주세요.');
                          return;
                        }
                        setDeleting(c);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Drawer
        open={!!deleting}
        onOpenChange={(v) => {
          if (!v) setDeleting(null);
        }}
        title="카테고리 삭제"
      >
        <p>“{deleting?.name}” 카테고리를 삭제할까요?</p>
        <button
          className="button full danger"
          onClick={async () => {
            try {
              await save({
                ...catalog,
                categories: catalog.categories.filter((c) => c.id !== deleting?.id),
              });
              setDeleting(null);
            } catch {
              toast('삭제 실패');
            }
          }}
        >
          삭제 확인
        </button>
      </Drawer>
    </>
  );
}
const contentSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  eyebrow: z.string().min(1),
  image: z.string().regex(/^(\/images\/|https:\/\/)/),
  link: z
    .string()
    .regex(/^\/(women|men|new)(\?.*)?$/, '컬렉션 경로 /women, /men, /new를 입력하세요.'),
});
export function AdminContent() {
  const { catalog, save } = useCatalog(),
    [content, setContent] = useState(catalog.content),
    [featured, setFeatured] = useState(
      catalog.products.filter((p) => p.isFeatured).map((p) => p.id),
    ),
    [error, setError] = useState('');
  return (
    <>
      <AdminTitle title="Content studio" subtitle="시즌의 이야기와 추천 상품을 큐레이션하세요." />
      <form
        className="admin-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const result = contentSchema.safeParse(content);
          if (!result.success) {
            setError(result.error.issues.map((i) => i.message).join(' '));
            return;
          }
          try {
            await save({
              ...catalog,
              content: result.data,
              products: catalog.products.map((p) => ({
                ...p,
                isFeatured: featured.includes(p.id),
              })),
            });
            setError('');
          } catch {
            setError('저장 실패');
          }
        }}
      >
        {(['eyebrow', 'title', 'subtitle', 'image', 'link'] as const).map((key, i) => (
          <label key={key} className="form-field">
            {['시즌 라벨', '배너 제목', '배너 설명', '배너 이미지 경로', '컬렉션 링크'][i]}
            <textarea
              rows={key === 'title' || key === 'subtitle' ? 2 : 1}
              value={content[key]}
              onChange={(e) => setContent({ ...content, [key]: e.target.value })}
              required
            />
          </label>
        ))}
        <fieldset className="featured-options">
          <legend>에디터 추천 상품</legend>
          {catalog.products.map((p) => (
            <label key={p.id}>
              <input
                type="checkbox"
                checked={featured.includes(p.id)}
                onChange={() =>
                  setFeatured(
                    featured.includes(p.id)
                      ? featured.filter((id) => id !== p.id)
                      : [...featured, p.id],
                  )
                }
              />
              {p.name}
            </label>
          ))}
        </fieldset>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="button" type="submit">
          콘텐츠 저장
        </button>
      </form>
    </>
  );
}
