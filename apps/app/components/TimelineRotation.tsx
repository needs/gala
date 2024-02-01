import {
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  getApparatusIconPath,
  getApparatusName,
  getRotationApparatuses,
} from '../lib/store';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import { useState } from 'react';
import SelectTeamDialog from './SelectTeamDialog';
import { Add, Remove } from '@mui/icons-material';
import EditTeamDialog from './EditTeamDialog';
import EditPlayerButton from './EditPlayerButton';
import { Stage, Team, TimelineRotation } from '@tgym.fr/core';
import { useCompetition } from './StoreProvider';

function TimelineAddTeamButton({
  onAdd,
}: {
  onAdd: (teamKey: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SelectTeamDialog
        open={open}
        onSelect={(teamKey) => {
          setOpen(false);
          onAdd(teamKey);
        }}
        onClose={() => setOpen(false)}
      />
      <Button
        variant="text"
        startIcon={<Add />}
        size="small"
        onClick={() => {
          setOpen(true);
        }}
      >
        Équipe
      </Button>
    </>
  );
}

function TimelineEditTeamButton({
  team,
  onRemove,
  readOnly,
}: {
  team: Team;
  onRemove: () => void;
  readOnly?: boolean;
}) {
  const { players } = useCompetition();
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditTeamDialog open={open} team={team} onClose={() => setOpen(false)} />
      <ButtonBase
        onClick={readOnly ? undefined : () => setOpen(true)}
        component="div"
      >
        <Stack padding={2} gap={1} flexGrow={1}>
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" gap={1} alignItems="center">
              <Typography variant="body1">{team.name}</Typography>
              {team.label !== undefined && (
                <Typography
                  variant="caption"
                  px={1}
                  py={0.25}
                  sx={{
                    backgroundColor: '#eeeeee',
                    borderRadius: 2,
                  }}
                >
                  Équipe {team.label}
                </Typography>
              )}
            </Stack>

            {!readOnly && (
              <IconButton
                size="small"
                onClick={onRemove}
                sx={{ justifySelf: 'end' }}
              >
                <Remove />
              </IconButton>
            )}
          </Stack>
          {Object.keys(team.members).map((playerKey) => {
            const player = players[playerKey];

            return (
              player !== undefined && (
                <EditPlayerButton
                  key={playerKey}
                  player={player}
                  onDelete={
                    readOnly
                      ? undefined
                      : () => {
                          delete team.members[playerKey];
                          delete players[playerKey];
                        }
                  }
                />
              )
            );
          })}
        </Stack>
      </ButtonBase>
    </>
  );
}

export default function TimelineRotation({
  stage,
  rotation,
  readOnly,
}: {
  stage: Stage;
  rotation: TimelineRotation;
  readOnly?: boolean;
}) {
  const { teams } = useCompetition();
  const rotationApparatuses = getRotationApparatuses(stage, rotation);

  return (
    <Paper elevation={1}>
      <Grid container>
        {rotationApparatuses.map((apparatuseKey) => {
          const apparatus = rotation.apparatuses[apparatuseKey];
          const apparatusTeams = apparatus === undefined ? {} : apparatus.teams;

          return (
            <Grid
              key={apparatuseKey}
              xs
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: (theme) => theme.palette.grey[50],
                },
              }}
            >
              <Stack alignItems="stretch" flexGrow={1}>
                <Stack
                  direction="row"
                  gap={2}
                  justifyContent="space-between"
                  padding={2}
                  sx={{
                    backgroundColor: '#a5a5a511',
                  }}
                >
                  <Stack
                    direction="row"
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image
                      src={getApparatusIconPath(apparatuseKey)}
                      alt={getApparatusName(apparatuseKey)}
                      width={24}
                      height={24}
                    />
                    <Typography variant="h6">
                      {getApparatusName(apparatuseKey)}
                    </Typography>
                  </Stack>

                  {!readOnly && (
                    <TimelineAddTeamButton
                      onAdd={(teamKey) => {
                        const apparatus = rotation.apparatuses[apparatuseKey];

                        if (apparatus === undefined) {
                          rotation.apparatuses[apparatuseKey] = {
                            teams: { [teamKey]: true },
                          };
                        } else {
                          apparatus.teams[teamKey] = true;
                        }
                      }}
                    />
                  )}
                </Stack>

                <Stack flexGrow={1} direction="column" divider={<Divider />}>
                  {Object.keys(apparatusTeams).map((teamKey) => {
                    const team = teams[teamKey];

                    return (
                      team !== undefined && (
                        <TimelineEditTeamButton
                          key={teamKey}
                          team={team}
                          onRemove={() => {
                            delete apparatusTeams[teamKey];
                          }}
                          readOnly={readOnly}
                        />
                      )
                    );
                  })}
                </Stack>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
