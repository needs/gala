import { child, push, ref, remove, set } from "firebase/database";
import { Player, database } from "./database";

const playersRef = ref(database, 'players');

export function addPlayer(player: Player) {
  const newPlayerKey = push(playersRef).key;

  if (newPlayerKey === null) {
    throw new Error('newPlayerKey is null');
  }

  set(child(playersRef, newPlayerKey), player);
  return newPlayerKey;
};

export function updatePlayer(playerKey: string, player: Player) {
  set(child(playersRef, playerKey), player);
};

export function deletePlayer(playerKey: string) {
  remove(child(playersRef, playerKey));
};
