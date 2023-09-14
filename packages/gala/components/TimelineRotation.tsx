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
  ApparatusKey,
  Team,
  TimelineRotation,
  getApparatusIconPath,
  getApparatusName,
  useGala,
} from '../lib/store';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import { useState } from 'react';
import SelectTeamDialog from './SelectTeamDialog';
import { Add, Remove } from '@mui/icons-material';
import EditTeamDialog from './EditTeamDialog';
import EditPlayerButton from './EditPlayerButton';

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
  const { players } = useGala();
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
            <Typography variant="body1">{team.name}</Typography>
            {!readOnly && (
              <IconButton size="small" onClick={onRemove}>
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
  apparatuses,
  rotation,
  readOnly,
}: {
  apparatuses: ApparatusKey[];
  rotation: TimelineRotation;
  readOnly?: boolean;
}) {
  const { teams } = useGala();

  return (
    <Paper elevation={1}>
      <Grid container>
        {apparatuses.map((apparatuseKey) => {
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
                    <TimelineAddTeamButton onAdd={(teamKey) => {
                      const apparatus = rotation.apparatuses[apparatuseKey];

                      if (apparatus === undefined) {
                        rotation.apparatuses[apparatuseKey] = {
                          teams: { [teamKey]: true },
                        };
                      } else {
                        apparatus.teams[teamKey] = true;
                      }
                    }} />
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
