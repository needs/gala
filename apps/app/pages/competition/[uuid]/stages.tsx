import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Delete,
  Remove,
} from '@mui/icons-material';
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { uuidv4 } from 'lib0/random';
import Image from 'next/image';
import SelectApparatusDialog from '../../../components/SelectApparatusDialog';
import { withAuthCompetition } from '../../../lib/auth';
import {
  getApparatusIconPath,
  getApparatusName,
  stageApparatuses,
} from '../../../lib/store';
import { useEffect, useState } from 'react';
import { ApparatusKey, allApparatusKeys } from '@tgym.fr/core';
import { useCompetition } from '../../../components/StoreProvider';

function AddApparatusButton({
  apparatuses,
  onAdd,
}: {
  apparatuses: ApparatusKey[];
  onAdd: (apparatus: ApparatusKey) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SelectApparatusDialog
        apparatuses={apparatuses}
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(apparatus) => {
          setOpen(false);
          onAdd(apparatus);
        }}
      />
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        disabled={apparatuses.length === 0}
      >
        Agrès
      </Button>
    </>
  );
}

export default function StagesPage() {
  const { stages } = useCompetition();

  useEffect(() => {
    for (const stage of Object.values(stages)) {
      if (stage !== undefined && stage.apparatuses === undefined) {
        const apparatuses = {};

        // Estimate stages from timeline
        Object.values(stage.timeline).forEach((rotation) => {
          if (rotation.type === 'rotation') {
            Object.assign(apparatuses, rotation.apparatuses);
          }
        });

        stage.apparatuses = apparatuses;
      }
    }
  }, [stages]);

  const addStage = (apparatuses: ApparatusKey[]) => {
    const name = `Plateau ${Object.keys(stages).length + 1}`;

    stages[uuidv4()] = {
      name,
      timeline: {},
      timelineStartDate: new Date().toString(),
      apparatuses: Object.fromEntries(
        apparatuses.map((apparatusKey, index) => [apparatusKey, index])
      ),
    };
  };

  return (
    <Stack gap={4} padding={4}>
      <Stack
        gap={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h5" component="h1">
          Plateaux
        </Typography>
        <Stack direction="row" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={() => addStage(['vault', 'floor', 'unevenBars', 'beam'])}
          >
            Plateau Femme
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() =>
              addStage([
                'vault',
                'floor',
                'rings',
                'pommelHorse',
                'highBar',
                'parallelBars',
              ])
            }
          >
            Plateau Homme
          </Button>
        </Stack>
      </Stack>

      {Object.entries(stages).map(([stageKey, stage]) => {
        if (stage !== undefined) {
          const apparatuses = stageApparatuses(stage);

          const teamsCountPerApparatus: Partial<Record<ApparatusKey, number>> =
            {};

          for (const rotation of Object.values(stage.timeline)) {
            if (rotation.type === 'rotation') {
              for (const [apparatusKey, apparatus] of Object.entries(
                rotation.apparatuses
              )) {
                const count =
                  teamsCountPerApparatus[apparatusKey as ApparatusKey] ?? 0;
                teamsCountPerApparatus[apparatusKey as ApparatusKey] =
                  count + Object.keys(apparatus.teams).length;
              }
            }
          }

          return (
            <Stack key={stageKey} direction="column" gap={2}>
              <Stack
                direction="row"
                gap={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <TextField
                  label="Nom du plateau"
                  value={stage.name}
                  onChange={(event) => (stage.name = event.target.value)}
                  sx={{
                    width: 300,
                  }}
                />
                <Stack direction="row" gap={2}>
                  <AddApparatusButton
                    apparatuses={allApparatusKeys.filter(
                      (apparatus) =>
                        stage.apparatuses === undefined ||
                        !(apparatus in stage.apparatuses)
                    )}
                    onAdd={(apparatus) => {
                      if (stage.apparatuses === undefined) {
                        stage.apparatuses = {};
                      }

                      stage.apparatuses[apparatus] = Object.keys(
                        stage.apparatuses
                      ).length;
                    }}
                  />

                  <IconButton
                    onClick={() => {
                      delete stages[stageKey];
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </Stack>

              {apparatuses.map((apparatusKey, apparatusOrder) => (
                <Stack
                  key={apparatusKey}
                  direction="row"
                  gap={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" gap={2} alignItems="center">
                    <Image
                      src={getApparatusIconPath(apparatusKey as ApparatusKey)}
                      alt={getApparatusName(apparatusKey as ApparatusKey)}
                      width={32}
                      height={32}
                    />
                    <Stack direction="column" gap={0}>
                      <Typography variant="h6" component="h1">
                        {getApparatusName(apparatusKey as ApparatusKey)}
                      </Typography>
                      <Typography variant="caption">
                        {teamsCountPerApparatus[apparatusKey as ApparatusKey] ??
                          0}{' '}
                        équipes
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" gap={2}>
                    <IconButton
                      onClick={() => {
                        if (stage.apparatuses !== undefined) {
                          const prevApparatusKey =
                            apparatuses[apparatusOrder - 1];

                          stage.apparatuses[prevApparatusKey] = apparatusOrder;
                          stage.apparatuses[apparatusKey] = apparatusOrder - 1;
                        }
                      }}
                      disabled={apparatusOrder === 0}
                    >
                      <ArrowUpward />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        if (stage.apparatuses !== undefined) {
                          const nextApparatusKey =
                            apparatuses[apparatusOrder + 1];

                          stage.apparatuses[nextApparatusKey] = apparatusOrder;
                          stage.apparatuses[apparatusKey] = apparatusOrder + 1;
                        }
                      }}
                      disabled={apparatusOrder === apparatuses.length - 1}
                    >
                      <ArrowDownward />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        if (stage.apparatuses !== undefined) {
                          delete stage.apparatuses[
                            apparatusKey as ApparatusKey
                          ];

                          for (const [apparatusKey, order] of Object.entries(
                            stage.apparatuses
                          )) {
                            if (order > apparatusOrder) {
                              stage.apparatuses[apparatusKey as ApparatusKey] =
                                order - 1;
                            }
                          }
                        }
                      }}
                    >
                      <Remove />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          );
        }
      })}
    </Stack>
  );
}

export const getServerSideProps = withAuthCompetition('stages');
