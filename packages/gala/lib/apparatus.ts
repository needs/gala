import { ApparatusKey } from "./database";

export const apparatuses: Record<ApparatusKey, {
  name: string;
  iconPath: string;
}> = {
  vault: {
    name: 'Saut',
    iconPath: "/icons/apparatuses/vault.png",
  },
  unevenBars:{
    name: 'Barres',
    iconPath: "/icons/apparatuses/unevenBars.png",
  },
  beam: {
    name: 'Poutre',
    iconPath: "/icons/apparatuses/beam.png",
  },
  floor: {
    name: 'Sol',
    iconPath: "/icons/apparatuses/floor.png",
  },
};
