import { Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { PageProps } from '../../_app';
import { useCompetition } from '../../../components/StoreProvider';
import { useState } from 'react';
import GenderAvatar from '../../../components/GenderAvatar';
import { getTeamName, getTeamNameSxProps } from '../../../lib/team';

export default function Index() {
  const { players, teams, stages } = useCompetition();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlayers = Object.entries(players)
    .filter(([playerKey, player]) => {
      if (searchQuery === '') {
        return false;
      }

      const lowerCaseSearchQuery = searchQuery.toLowerCase();

      return `${player.firstName.toLowerCase()} ${player.lastName.toLowerCase()}`.includes(
        lowerCaseSearchQuery
      );
    })
    .map(([playerKey, player]) => {
      const playerTeam = Object.entries(teams).find(([teamKey, team]) => {
        if (team.members[playerKey] !== undefined) {
          return true;
        }
      });

      if (playerTeam === undefined) {
        return { playerKey, player };
      }

      const [teamKey, team] = playerTeam;

      const rotationsPerStage = Object.entries(stages)
        .map(([stageKey, stage]) => {
          return {
            stage,
            stageKey,
            rotations: Object.values(stage.timeline).filter((rotation) => {
              if (rotation.type !== 'rotation') {
                return false;
              }

              return Object.values(rotation.apparatuses).some((apparatus) => {
                return Object.keys(apparatus.teams).includes(teamKey);
              });
            }),
          };
        })
        .filter(({ rotations }) => rotations.length > 0)
        .flatMap(({ stage, stageKey, rotations }) => {
          return rotations.map((rotation) => {
            return {
              stage,
              stageKey,
              rotation,
            };
          });
        });

      return { playerKey, player, team, rotationsPerStage };
    });

  return (
    <Stack gap={4} p={4}>
      <Stack gap={2}>
        <Typography variant="h5" component="h1">
          Rechercher un ou une gymnaste
        </Typography>
        <TextField
          label="Nom ou Prénom..."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        {filteredPlayers.map(
          ({ playerKey, player, team, rotationsPerStage }) => (
            <Paper key={playerKey}>
              <Stack direction="column" divider={<Divider />}>
                <Stack
                  direction="row"
                  gap={2}
                  alignItems="center"
                  px={2}
                  py={1}
                >
                  <GenderAvatar gender={player.gender} />
                  <Stack direction="column" gap={0}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {player.firstName} {player.lastName.toUpperCase()}
                    </Typography>
                    {team === undefined && (
                      <Typography sx={{ fontStyle: 'italic' }}>
                        Sans équipe
                      </Typography>
                    )}
                    {team !== undefined && (
                      <Stack direction="row" gap={1}>
                        <Typography sx={getTeamNameSxProps(team)}>
                          {getTeamName(team)}
                        </Typography>
                        {team.label !== undefined && (
                          <Typography
                            variant="caption"
                            px={1}
                            py={0.5}
                            sx={{
                              backgroundColor: '#eeeeee',
                              borderRadius: 2,
                            }}
                          >
                            Équipe {team.label}
                          </Typography>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Stack>
                {rotationsPerStage !== undefined &&
                  rotationsPerStage.map(({ stage, stageKey, rotation }) => (
                    <Stack key={stageKey} direction="row" gap={1} px={2} py={1}>
                      <Typography sx={{ fontWeight: "bold" }}>{stage.name}</Typography>
                      <Typography>Commence dans 10 minutes</Typography>
                    </Stack>
                  ))}
              </Stack>
            </Paper>
          )
        )}
      </Stack>
    </Stack>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const competitionUuid = context.query.uuid as string;
  return {
    props: {
      competitionUuid: competitionUuid,

      layoutInfo: {
        menu: 'visitor',
        selected: 'home',
        uuid: competitionUuid,
      },
    },
  };
};
