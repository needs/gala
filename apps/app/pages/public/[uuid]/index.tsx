import { Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { PageProps } from '../../_app';
import { useCompetition } from '../../../components/StoreProvider';
import { useState } from 'react';
import GenderAvatar from '../../../components/GenderAvatar';
import { getTeamName, getTeamNameSxProps } from '../../../lib/team';
import { computeTimeline } from '../../../lib/progress';
import { compact } from 'lodash';
import { formatRotationTime } from '../../competition/[uuid]/progress';
import { getApparatusName } from '../../../lib/store';

export default function Index() {
  const { players, teams, schedules } = useCompetition();
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

      const rotationsPerSchedule = Object.entries(schedules)
        .map(([scheduleUuid, schedule]) => {
          return {
            schedule,
            scheduleUuid,
            apparatuses: compact(
              computeTimeline(schedule).flatMap((timelineEvent) => {
                if (timelineEvent.type !== 'rotation') {
                  return [];
                }

                return Object.entries(timelineEvent.apparatuses).map(
                  ([apparatusUuid, apparatus]) => {
                    if (Object.keys(apparatus.teams).includes(teamKey)) {
                      return {
                        apparatusType: apparatus.type,
                        startDate: timelineEvent.startDate,
                        endDate: timelineEvent.endDate,
                      };
                    } else {
                      return undefined;
                    }
                  }
                );
              })
            ),
          };
        })
        .filter(({ apparatuses }) => apparatuses.length > 0);

      return { playerKey, player, team, rotationsPerSchedule };
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
          ({ playerKey, player, team, rotationsPerSchedule }) => (
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
                {rotationsPerSchedule !== undefined &&
                  rotationsPerSchedule.map(
                    ({ schedule, scheduleUuid, apparatuses }) => (
                      <Stack
                        key={scheduleUuid}
                        direction="column"
                        gap={1}
                        px={2}
                        py={1}
                      >
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {schedule.name}
                        </Typography>
                        {apparatuses.map(
                          ({ apparatusType, startDate, endDate }, index) => {
                            return (
                              <Stack key={index} direction="row" gap={1} pl={2}>
                                <Typography>
                                  {getApparatusName(apparatusType)}
                                </Typography>
                                <Typography>
                                  {formatRotationTime(startDate, endDate)}
                                </Typography>
                              </Stack>
                            );
                          }
                        )}
                      </Stack>
                    )
                  )}
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
