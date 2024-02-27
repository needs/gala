import {
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { getApparatusIconPath, getApparatusName } from '../lib/store';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import { useState } from 'react';
import SelectTeamDialog from './SelectTeamDialog';
import { Add, Edit, Remove } from '@mui/icons-material';
import EditTeamDialog from './EditTeamDialog';
import EditPlayerButton from './EditPlayerButton';
import {
  ScheduleEventRotation,
  ScheduleEventRotationApparatus,
  Team,
} from '@tgym.fr/core';
import { useCompetition } from './StoreProvider';
import { getTeamName, getTeamNameSxProps } from '../lib/team';

function AddTeamButton({ onAdd }: { onAdd: (teamKey: string) => void }) {
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

function EditTeamButton({
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
      <Stack padding={2} gap={1} flexGrow={1}>
        <Stack direction="row" gap={1} alignItems="center">
          <Stack direction="row" gap={1} alignItems="center" flexGrow={1}>
            <Typography variant="body1" sx={getTeamNameSxProps(team)}>
              {getTeamName(team)}
            </Typography>
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
              onClick={() => setOpen(true)}
              sx={{ justifySelf: 'end' }}
            >
              <Edit />
            </IconButton>
          )}
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
    </>
  );
}

export default function ScheduleEventRotation({
  apparatuses,
  onRemove,
  readOnly,
}: {
  apparatuses: {
    apparatus: ScheduleEventRotationApparatus;
    apparatusUuid: string;
  }[];
  onRemove?: (apparatusUuid: string) => void;
  readOnly?: boolean;
}) {
  const { teams } = useCompetition();

  return (
    <Paper elevation={1}>
      <Grid container>
        {apparatuses.map(({ apparatus, apparatusUuid }) => {
          return (
            <Grid
              key={apparatusUuid}
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
                      src={getApparatusIconPath(apparatus.type)}
                      alt={getApparatusName(apparatus.type)}
                      width={24}
                      height={24}
                    />
                    <Typography variant="h6">
                      {getApparatusName(apparatus.type)}
                    </Typography>
                  </Stack>
                  {!readOnly && onRemove !== undefined && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        onRemove(apparatusUuid);
                      }}
                    >
                      <Remove />
                    </IconButton>
                  )}
                </Stack>

                <Stack flexGrow={1} direction="column" divider={<Divider />}>
                  {Object.keys(apparatus.teams).map((teamUuid) => {
                    const team = teams[teamUuid];

                    return (
                      team !== undefined && (
                        <EditTeamButton
                          key={teamUuid}
                          team={team}
                          onRemove={() => {
                            delete apparatus.teams[teamUuid];
                          }}
                          readOnly={readOnly}
                        />
                      )
                    );
                  })}
                  {!readOnly && (
                    <Stack alignItems="end" p={2}>
                      <AddTeamButton
                        onAdd={(teamKey) => {
                          apparatus.teams[teamKey] = true;
                        }}
                      />
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
