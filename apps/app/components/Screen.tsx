import { Box, Divider, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { fullName } from '../lib/utils';
import GenderAvatar from '../components/GenderAvatar';
import {
  getApparatusIconPath,
  getApparatusName,
} from '../lib/store';
import { ApparatusKey, allApparatusKeys } from '@tgym.fr/core';
import { useCompetition } from './StoreProvider';

function Apparatus({
  apparatusKey,
  stageKey,
}: {
  apparatusKey: ApparatusKey;
  stageKey: 'stage1' | 'stage2';
}) {
  const width = `${(1 / allApparatusKeys.length) * 100}%`;

  const { teams, progresses, players } = useCompetition();

  const progress = progresses[stageKey];

  if (progress === undefined) {
    return null;
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
      <Image
        src={getApparatusIconPath(apparatusKey)}
        alt="Vault"
        width={96}
        height={96}
      />
      <Typography variant="h1">{getApparatusName(apparatusKey)}</Typography>
      {team !== undefined && (
        <>
          <Typography variant="h4" paddingY={3} paddingX={1}>
            {team.name}
          </Typography>

          <Stack direction="column" gap={2} width="100%">
            {Object.keys(team.members).map((playerKey) => {
              const player = players[playerKey];

              return (
                player !== undefined && (
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
                )
              );
            })}
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default function Screen({
  stageName,
  stageKey,
}: {
  stageName: string;
  stageKey: 'stage1' | 'stage2';
}) {
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
        {allApparatusKeys.map((apparatusKey) => (
          <Apparatus
            stageKey={stageKey}
            key={apparatusKey}
            apparatusKey={apparatusKey}
          />
        ))}
      </Stack>
    </Stack>
  );
}
