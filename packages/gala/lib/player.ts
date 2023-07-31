import { Player } from "./store";
import { v4 as uuidv4 } from 'uuid';

export const defaultPlayer: Player = {
  firstName: "",
  lastName: "",
  gender: "woman",
};

export function addPlayer(players: Partial<Record<string, Player>>, player: Player) {
  const newPlayerKey = uuidv4();
  players[newPlayerKey] = player;
  return newPlayerKey;
};
