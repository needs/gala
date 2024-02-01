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

export function fullTeamName(team: Team) {
  const teamName = getTeamName(team);
  const teamLabel = team.label === undefined ? '' : ` - Équipe ${team.label}`;
  return `${teamName}${teamLabel}`
}

export function getTeamName(team: Team) {
  return team.name === '' ? 'Équipe sans nom' : team.name;
}

export function getTeamNameSxProps(team: Team) {
  return team.name === '' ? { fontStyle: 'italic' } : {};
}
