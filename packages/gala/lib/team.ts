import { Team, database } from "./database";
import { v4 as uuidv4 } from 'uuid';

export const defaultTeam: Team = {
  name: '',
  members: {},
};

export function addTeam(teams: Partial<Record<string, Team>>, team: Team) {
  const newTeamKey = uuidv4();
  teams[newTeamKey] = team;
  return newTeamKey;
};
