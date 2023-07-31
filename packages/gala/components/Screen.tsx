import { Box, Divider, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { Apparatus, apparatuses } from '../lib/apparatus';
import Loading from '../components/Loading';
import { fullName } from '../lib/utils';
import GenderAvatar from '../components/GenderAvatar';
import { useSyncedStore } from '@syncedstore/react';
import { ApparatusKey, store } from '../lib/store';

function Apparatus({
  apparatusKey,
  apparatus,
  stageKey,
}: {
  apparatusKey: ApparatusKey;
  apparatus: Apparatus;
  stageKey: 'stage1' | 'stage2';
}) {
  const width = `${(1 / Object.entries(apparatuses).length) * 100}%`;

  const { teams, progresses, players } = useSyncedStore(store);

  const progress = progresses[stageKey];

  if (progress === undefined) {
    return <Loading />;
  }

  const teamKey = progress[apparatusKey];
  const team = teamKey !== undefined ? teams[teamKey] : undefined;

  return (
    <Stack
      direction="column"
      gap={2}
      alignItems="center"
      minWidth={width}
      maxWidth={width}
    >
      <Image src={apparatus.iconPath} alt="Vault" width={96} height={96} />
      <Typography variant="h1">{apparatus.name}</Typography>
      {team !== undefined && (
        <>
          <Typography variant="h4" paddingY={3} paddingX={1}>
            {team.name}
          </Typography>

          <Stack direction="column" gap={2} width="100%">
            {Object.keys(team.members).map((playerKey) => {
              const player = players[playerKey];

              return player !== undefined &&
              <Stack
                key={playerKey}
                direction="row"
                gap={2}
                alignItems="center"
                padding={2}
              >
                <GenderAvatar gender={player.gender} />
                <Typography key={playerKey} variant="h5">
                  {fullName(player)}
                </Typography>
              </Stack>
})}
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default function Screen({ stageName, stageKey}: { stageName: string, stageKey: 'stage1' | 'stage2' }) {
  return (
    <Stack
      direction="column"
      gap={2}
      alignItems="stretch"
      padding={2}
      width="100%"
    >
      <Box marginLeft="auto" marginRight="auto">
        <Typography variant="h1">{stageName}</Typography>
      </Box>

      <Stack
        direction="row"
        justifyContent="center"
        divider={<Divider orientation="vertical" />}
      >
        {Object.entries(apparatuses).map(([apparatusKey, apparatus]) => (
          <Apparatus stageKey={stageKey} key={apparatusKey} apparatusKey={apparatusKey as ApparatusKey} apparatus={apparatus} />
        ))}
      </Stack>
    </Stack>
  );
}
