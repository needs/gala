import { push, child, ref, set, remove } from "firebase/database";
import { Team, database } from "./database";

const teamsRef = ref(database, 'teams');

export const defaultTeam: Team = {
  name: '',
  members: {},
};

export function addTeam(team: Team) {
  const newTeamKey = push(teamsRef).key;

  if (newTeamKey === null) {
    throw new Error('newTeamKey is null');
  }

  set(child(teamsRef, newTeamKey), team);
  return newTeamKey;
};

export function updateTeam(teamKey: string, team: Team) {
  set(child(teamsRef, teamKey), team);
};

export function removeMember(teamKey: string, playerKey: string) {
  remove(child(child(child(teamsRef, teamKey), "members"), playerKey));
};
