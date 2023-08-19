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
export type Extra = { antoinette: boolean };
export type BarItem = Record<string, number[]>;

export type Store = {
  players: Record<string, Player>,
  teams: Record<string, Team>,
  categories: Record<string, Category>,
  judges: Record<string, Judge>,
  progresses: Record<string, Progress>,
  extra: Extra,
  bar: Record<string, BarItem>,
}

export const barDefault = {
  "Boissons": {
    "Bière": [2.5],
    'Jus de pommes': [1.5],
    'Soda (Fanta,Coca,Ice Tea,Oasis)': [1.5],
    "Eau": [0.5],
    'Café | Thé': [1.0]
  },
  "Plats": {
    'Hot-Dog': [3.0],
    "Frites": [3.0],
    'Saucisse+Frites': [5.0],
    'Sandwich (Fromage Brie)': [3.0]
  },
  "Grignotage": {
    "Pomme": [0.5],
    "Sucette": [0.5],
    'Barre Kinder Country': [1.0],
    'Crêpe (Sucre)': [2.0],
    'Crêpe (Nutella)': [2.5]
  }
}

export const store = syncedStore<Store>({ players: {}, teams: {}, categories: {}, progresses: {}, judges: {}, extra: {} as Extra, bar: {} });

export function initStore() {
  const doc = getYjsDoc(store);
  const provider = new HocuspocusProvider({
    url: "ws://127.0.0.1:1234",
    name: "gala-test",
    document: doc,
  });
  return () => {
    provider.destroy();
  }
}
