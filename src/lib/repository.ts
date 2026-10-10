import Dexie, { type EntityTable } from 'dexie';
import { seedCatalog, type Catalog } from '@/data/seed';
const db = new Dexie('eonve-demo') as Dexie & {
  catalog: EntityTable<{ id: string; data: Catalog }, 'id'>;
};
db.version(1).stores({ catalog: 'id' });
export const catalogRepository = {
  async read(): Promise<Catalog> {
    return (await db.catalog.get('main'))?.data ?? structuredClone(seedCatalog);
  },
  async write(data: Catalog) {
    await db.catalog.put({ id: 'main', data });
    window.dispatchEvent(new Event('eonve-catalog'));
    const channel = new BroadcastChannel('eonve');
    channel.postMessage('changed');
    channel.close();
  },
  async reset() {
    await db.catalog.delete('main');
    window.dispatchEvent(new Event('eonve-catalog'));
    const channel = new BroadcastChannel('eonve');
    channel.postMessage('changed');
    channel.close();
  },
};
