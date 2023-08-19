import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from "y-websocket";

export type Gender = "man" | "woman" | "mixed";
export type ApparatusKey = "vault" | "unevenBars" | "beam" | "floor";

export type Player = { firstName: string, lastName: string, gender: Gender };
export type Team = { name: string, members: Record<string, boolean>, categoryKey: string | undefined };
export type Category = { name: string, gender: Gender, apparatuses: Record<string, { name: string, icon: string }> };
export type Progress = Partial<Record<ApparatusKey, string>>;
export type Judge = { firstName: string, lastName: string };
export type Extra = { antoinette: boolean };

export type Store = {
  players: Record<string, Player>,
  teams: Record<string, Team>,
  categories: Record<string, Category>,
  judges: Record<string, Judge>,
  progresses: Record<string, Progress>,
  extra: Extra,
}

export const store = syncedStore<Store>({ players: {}, teams: {}, categories: {}, progresses: {}, judges: {}, extra: {} as Extra });

export function initStore() {
  const doc = getYjsDoc(store);
  const wsProvider = new WebsocketProvider('ws://localhost:1234', 'gala-test', doc)
  return () => {
    wsProvider.destroy();
  }
}
