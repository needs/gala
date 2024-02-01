import { Team } from "@tgym.fr/core";

// const regex = /\s+-+\s(équipe|equipe)\s(\w+)$/i;
const regex = /\s*-?\s*(équipe|equipe)\s(\w+)$/i;

export function hasTeamLabelToMigrate(teams: Team[]): boolean {
  return teams.some(
    (team) => {
      const match = regex.exec(team.name);
      return match !== null && match[0] !== team.name;
    }
  )
}

export function migrateTeam(team: Team): void {
  const match = regex.exec(team.name);

  if (match !== null && match[0] !== team.name) {
    if (team.label === undefined) {
      team.label = match[2];
    }
    team.name = team.name.replace(match[0], '');
  }
}

export function migrateTeamLabels(teams: Team[]) {
  for (const team of teams) {
    migrateTeam(team);
  }
}

export function restoreTeamLabels(teams: Record<string, Team>, savedTeams: Record<string, Team>) {
  for (const [teamUuid, savedTeam] of Object.entries(savedTeams)) {
    const team = teams[teamUuid];

    if (team !== undefined) {
      team.name = savedTeam.name;
      team.label = savedTeam.label;
    }
  }
}
