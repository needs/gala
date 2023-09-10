import { Add, Delete, Remove } from '@mui/icons-material';
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSyncedStore } from '@syncedstore/react';
import { uuidv4 } from 'lib0/random';
import { keyBy } from 'lodash';
import Image from 'next/image';
import SelectApparatusDialog from '../../../components/SelectApparatusDialog';
import { withAuthGala } from '../../../lib/auth';
import {
  ApparatusKey,
  getApparatusIconPath,
  getApparatusName,
  store,
} from '../../../lib/store';
import { useEffect, useState } from 'react';

function AddApparatusButton({
  onAdd,
}: {
  onAdd: (apparatus: ApparatusKey) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SelectApparatusDialog
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
      >
        Agrès
      </Button>
    </>
  );
}

export default function StagesPage() {
  const { stages } = useSyncedStore(store);

  useEffect(() => {
    for (const stage of Object.values(stages)) {
      if (stage !== undefined && stage.apparatuses === undefined) {
        const apparatuses = {};

        // Estimate stages from timeline
        Object.values(stage.timeline).forEach((rotation) => {
          if (rotation.type === 'rotation') {
            Object.assign(apparatuses, rotation.apparatuses);
            console.log('app', rotation.apparatuses);
          }
        });

        stage.apparatuses = apparatuses;
      }
    }
  }, [stages]);

  const addStage = () => {
    const name = `Plateau ${Object.keys(stages).length + 1}`;

    stages[uuidv4()] = {
      name,
      timeline: {},
      timelineStartDate: new Date().toString(),
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
            onClick={() => addStage()}
          >
            Plateau Femme
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => addStage()}
          >
            Plateau Homme
          </Button>
        </Stack>
      </Stack>

      {Object.entries(stages).map(
        ([stageKey, stage]) =>
          stage !== undefined && (
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
                    onAdd={(apparatus) => {
                      if (stage.apparatuses === undefined) {
                        stage.apparatuses = {};
                      }

                      stage.apparatuses[apparatus] = true;
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

              {Object.entries(stage.apparatuses ?? {}).map(
                ([apparatusKey, apparatus]) => (
                  <Stack key={apparatusKey} direction="row" gap={2} justifyContent="space-between">
                    <Stack direction="row" gap={2} alignItems="center">
                    <Image
                      src={getApparatusIconPath(apparatusKey as ApparatusKey)}
                      alt={getApparatusName(apparatusKey as ApparatusKey)}
                      width={32}
                      height={32}
                    />
                    <Typography variant="h6" component="h1">
                      {getApparatusName(apparatusKey as ApparatusKey)}
                    </Typography>
                    </Stack>
                    <Stack direction="row" gap={2}>
                      <IconButton
                        onClick={() => {
                          if (stage.apparatuses !== undefined) {
                            delete stage.apparatuses[
                              apparatusKey as ApparatusKey
                            ];
                          }
                        }}
                      >
                        <Remove />
                      </IconButton>
                    </Stack>
                  </Stack>
                )
              )}
            </Stack>
          )
      )}
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('stages');
