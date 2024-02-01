import { Team } from "@tgym.fr/core";
import { hasTeamLabelToMigrate, migrateTeam, restoreTeamLabels } from "./migrateTeamLabels";

function shouldNotMigrateTeam({
  teamName,
  teamLabel,
}: {
  teamName: string;
  teamLabel?: string;
}) {
  const team: Team = {
    name: teamName,
    label: teamLabel,
    members: {},
  };

  expect(hasTeamLabelToMigrate([team])).toEqual(false);

  migrateTeam(team);
  expect(team.name).toEqual(teamName);
  expect(team.label).toEqual(teamLabel);
};

function shouldMigrateTeam({
  teamName,
  teamLabel,
  expectedTeamName,
  expectedTeamLabel,
}: {
  teamName: string;
  teamLabel?: string;
  expectedTeamName: string;
  expectedTeamLabel?: string;
}) {
  const team: Team = {
    name: teamName,
    label: teamLabel,
    members: {},
  };

  expect(hasTeamLabelToMigrate([team])).toEqual(true);

  migrateTeam(team);
  expect(team.name).toEqual(expectedTeamName);
  expect(team.label).toEqual(expectedTeamLabel);

  expect(hasTeamLabelToMigrate([team])).toEqual(false);
}

describe('migrateTeam', () => {
  test('Ending with " - équipe 1"', () => {
    shouldMigrateTeam({
      teamName: "Nom - équipe 1",
      expectedTeamName: "Nom",
      expectedTeamLabel: '1',
    });
  });

  test('Ending with " - équipe"', () => {
    shouldNotMigrateTeam({
      teamName: "Nom - équipe",
    });
  });

  test('Having "équipe 1" in the middle', () => {
    shouldNotMigrateTeam({
      teamName: "Nom - équipe - Club",
    });
  });

  test('Ending with "équipe 1"', () => {
    shouldMigrateTeam({
      teamName: "Nom équipe 1",
      expectedTeamName: "Nom",
      expectedTeamLabel: '1',
    });
  });

  test('Ending with "- équipe 1" but already having a team label', () => {
    shouldMigrateTeam({
      teamName: "Nom - équipe 1",
      teamLabel: "2",
      expectedTeamName: "Nom",
      expectedTeamLabel: '2',
    });
  });

  test('Ending with "- Équipe 1" (case insensitivity)', () => {
    shouldMigrateTeam({
      teamName: "Nom - Équipe 1",
      expectedTeamName: "Nom",
      expectedTeamLabel: '1',
    });
  });

  test('Ending with "- EQUIPE 1" (case insensitivity and no accent)', () => {
    shouldMigrateTeam({
      teamName: "Nom - EQUIPE 1",
      expectedTeamName: "Nom",
      expectedTeamLabel: '1',
    });
  });
});


describe('restoreTeamLabels', () => {
  test('Leaving new teams untouched', () => {
    const teams: Record<string, Team> = {
      '1': {
        name: 'Team',
        label: '1',
        members: {},
      },
      '2': {
        name: 'Team 2',
        members: {},
      },
    };

    const savedTeams: Record<string, Team> = {
      '1': {
        name: 'Team 1',
        members: {},
      },
    };

    restoreTeamLabels(teams, savedTeams);

    expect(teams['1'].name).toEqual('Team 1');
    expect(teams['1'].label).toBeUndefined();

    expect(teams['2'].name).toEqual('Team 2');
    expect(teams['2'].label).toBeUndefined();
  });

  test('Ignoring deleted teams', () => {
    const teams: Record<string, Team> = {
    };

    const savedTeams: Record<string, Team> = {
      '1': {
        name: 'Team 1',
        members: {},
      },
    };

    restoreTeamLabels(teams, savedTeams);

    expect(teams).toEqual({});
  });
});
