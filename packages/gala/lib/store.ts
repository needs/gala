import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { HocuspocusProvider } from "@hocuspocus/provider";

export const genders = ["man", "woman", "mixed"] as const;
export type Gender = (typeof genders)[number];
export type ApparatusKey = "vault" | "unevenBars" | "beam" | "floor";

export type Player = { firstName: string, lastName: string, gender: Gender };
export type Team = { name: string, members: Record<string, boolean>, categoryKey: string | undefined };
export type Category = { name: string, gender: Gender, apparatuses: Record<string, { name: string, icon: string }> };
export type Progress = Partial<Record<ApparatusKey, string>>;
export type Judge = { firstName: string, lastName: string };
export type BarCategory = { name: string, items: BarItem[] };
export type BarItem = { name: string, price: number };
export type Info = { galaName: string };

export type Store = {
  players: Record<string, Player>,
  teams: Record<string, Team>,
  categories: Record<string, Category>,
  progresses: Record<string, Progress>,
  bar: BarCategory[],
  info: Info,
}

export const barDefault: BarCategory[] = [
  {
    name: "Boissons", items: [
      { name: "Bière", price: 2.5 },
      { name: 'Jus de pommes', price: 1.5 },
      { name: 'Soda, (Fanta,Coca,Ice Tea,Oasis)', price: 1.5 },
      { name: "Eau", price: 0.5 },
      { name: 'Café, Thé', price: 1.0 },
    ]
  },
  {
    name: "Plats", items: [
      { name: 'Hot-Dog', price: 3.0 },
      { name: "Frites", price: 3.0 },
      { name: 'Saucisse+Frites', price: 5.0 },
      { name: 'Sandwich (Fromage Brie)', price: 3.0 },
    ]
  },
  {
    name: "Dessert", items: [
      { name: "Pomme", price: 0.5 },
      { name: "Sucette", price: 0.5 },
      { name: 'Barre Kinder Country', price: 1.0 },
      { name: 'Crêpe (Sucre)', price: 2.0 },
      { name: 'Crêpe (Nutella)', price: 2.5 },
    ]
  }
]

export const store = syncedStore<Store>({ players: {}, teams: {}, categories: {}, progresses: {}, bar: [], info: {} as Info });

export function initStore(uuid: string, token: string, onLoad: () => void, onUnload: () => void) {
  const doc = getYjsDoc(store);

  const provider = new HocuspocusProvider({
    url: "ws://127.0.0.1:1234",
    name: uuid,
    document: doc,
    token,
    onSynced: () => {
      onLoad();
    },
  });

  return () => {
    onUnload();
    provider.destroy();
  }
}
