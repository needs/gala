import { Team } from '@tgym.fr/core';
import { v4 as uuidv4 } from 'uuid';

export const defaultTeam: Team = {
  name: '',
  members: {},
  categoryKey: undefined,
};

export function addTeam(teams: Partial<Record<string, Team>>, team: Team) {
  const newTeamKey = uuidv4();
  teams[newTeamKey] = team;
  return newTeamKey;
}
