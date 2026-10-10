'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { seedCatalog, type Catalog } from '@/data/seed';
import { catalogRepository } from '@/lib/repository';
import { useShop } from '@/lib/store';
type Context = {
  catalog: Catalog;
  ready: boolean;
  error: string;
  save: (data: Catalog) => Promise<void>;
  reset: () => Promise<void>;
  toast: (text: string) => void;
};
const CatalogContext = createContext<Context | null>(null);
export function Providers({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState(seedCatalog),
    [ready, setReady] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const toast = useCallback((text: string) => setMessage(text), []);
  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const data = await catalogRepository.read();
        if (live) {
          setCatalog(data);
          setError('');
        }
      } catch {
        if (live) setError('브라우저 저장소를 사용할 수 없습니다. 기본 상품을 표시합니다.');
      } finally {
        if (live) setReady(true);
      }
    };
    void load();
    void useShop.persist.rehydrate();
    window.addEventListener('eonve-catalog', load);
    const channel = new BroadcastChannel('eonve');
    channel.onmessage = load;
    return () => {
      live = false;
      channel.close();
      window.removeEventListener('eonve-catalog', load);
    };
  }, []);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3500);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const save = async (data: Catalog) => {
    try {
      await catalogRepository.write(data);
      setCatalog(data);
      toast('변경사항을 저장했습니다.');
    } catch {
      toast('저장하지 못했습니다. 브라우저 저장 공간을 확인하세요.');
      throw new Error('저장 실패');
    }
  };
  const reset = async () => {
    await catalogRepository.reset();
    useShop.getState().reset();
    setCatalog(structuredClone(seedCatalog));
    toast('데모 데이터를 초기화했습니다.');
  };
  return (
    <CatalogContext.Provider value={{ catalog, ready, error, save, reset, toast }}>
      {error && (
        <p className="storage-error" role="alert">
          {error}
        </p>
      )}
      {children}
      <div className={`toast ${message ? 'visible' : ''}`} role="status" aria-live="polite">
        {message}
      </div>
    </CatalogContext.Provider>
  );
}
export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('Catalog provider missing');
  return ctx;
}
