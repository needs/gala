import { Alert, Box, CssBaseline, Stack, Typography } from '@mui/material';
import {
  ApparatusKey,
  ScreenProgress,
  TimelineRotation,
  getApparatusIconPath,
  getApparatusName,
  stageApparatuses,
  useGala,
} from '../../lib/store';
import { getCurrentRotation } from '../../lib/progress';
import Image from 'next/image';
import GenderAvatar from '../GenderAvatar';
import { useEffect, useRef, useState } from 'react';

function Start() {
  return (
    <Box flexGrow="1" display="flex">
      <Typography variant="h1" textAlign="center" marginY="auto" flexGrow="1">
        {'Le plateau va bientôt commencer'}
      </Typography>
    </Box>
  );
}

function End() {
  return (
    <Box flexGrow="1" display="flex">
      <Typography variant="h1" textAlign="center" marginY="auto" flexGrow="1">
        {'Le plateau est terminé'}
      </Typography>
    </Box>
  );
}

function Rotation({
  rotation,
  apparatuses,
}: {
  rotation: TimelineRotation;
  apparatuses: ApparatusKey[];
}) {
  const { teams, players, categories } = useGala();

  const [scrollIndex, setScrollIndex] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, apparatuses.length);
  }, [apparatuses.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((scrollIndex) => scrollIndex + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [refs.current.length, setScrollIndex]);

  useEffect(() => {
    refs.current[scrollIndex % refs.current.length]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [scrollIndex]);

  return (
    <Stack
      direction="row"
      gap={4}
      padding={4}
      flexGrow="1"
      alignItems="start"
      overflow="hidden"
    >
      {apparatuses.map((apparatus, index) => {
        const rotationApparatus = rotation.apparatuses[apparatus];

        return (
          <Stack
            key={apparatus}
            flexGrow="1"
            bgcolor="#ffffff87"
            borderRadius={8}
            minWidth="26vw"
            ref={(el) => (refs.current[index] = el)}
          >
            <Stack direction="row" gap={4} alignItems="center" padding={4}>
              <Image
                src={getApparatusIconPath(apparatus)}
                alt="Vault"
                width={96}
                height={96}
              />

              <Typography variant="h2" fontWeight="bold">
                {getApparatusName(apparatus)}
              </Typography>
            </Stack>

            <Stack gap={4}>
              {rotationApparatus !== undefined &&
                Object.keys(rotationApparatus.teams).map((teamKey) => {
                  const team = teams[teamKey];
                  const category = categories[team.categoryKey ?? ''];

                  return (
                    team !== undefined && (
                      <Stack
                        key={teamKey}
                        direction="column"
                        padding={2}
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: 8,
                        }}
                      >
                        <Stack paddingY={3} paddingX={1}>
                          <Typography variant="h4" fontWeight="bold">
                            {team.name}
                          </Typography>
                          <Typography variant="h5" color="grey">
                            {category.name}
                          </Typography>
                        </Stack>

                        <Stack direction="column" gap={2} width="100%">
                          {Object.keys(team.members).map((playerKey) => {
                            const player = players[playerKey];

                            return (
                              player !== undefined && (
                                <Stack
                                  key={playerKey}
                                  direction="row"
                                  gap={4}
                                  alignItems="center"
                                  padding={2}
                                >
                                  <GenderAvatar
                                    gender={player.gender}
                                    size={56}
                                  />
                                  <Typography variant="h4">
                                    {player.firstName} {player.lastName}
                                  </Typography>
                                </Stack>
                              )
                            );
                          })}
                        </Stack>
                      </Stack>
                    )
                  );
                })}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}

function Pause() {
  return (
    <Box flexGrow="1" display="flex">
      <Typography variant="h1" textAlign="center" marginY="auto" flexGrow="1">
        {'Pause'}
      </Typography>
    </Box>
  );
}

export default function ScreenProgress({ screen }: { screen: ScreenProgress }) {
  const { stages } = useGala();

  const stage =
    stages[screen.stageKey] !== undefined
      ? stages[screen.stageKey]
      : Object.values(stages)[0];

  if (stage === undefined) {
    return (
      <Alert severity="info">
        {"Aucun plateau n'a été ajouté à la compétition"}
      </Alert>
    );
  }

  const { currentRotation } = getCurrentRotation(stage);

  const apparatuses = stageApparatuses(stage);

  const rotationComponent = () => {
    switch (currentRotation.type) {
      case 'start':
        return <Start />;
      case 'end':
        return <End />;
      case 'rotation':
        return (
          <Rotation
            rotation={currentRotation.rotation}
            apparatuses={apparatuses}
          />
        );
      case 'pause':
        return <Pause />;
    }
  };

  return (
    <Box>
      <CssBaseline />
      <Stack
        minHeight="100vh"
        sx={{
          backgroundImage: 'url("/tv-background.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            backgroundImage: 'url("/background.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          padding={4}
        >
          <Typography textAlign="center" variant="h1" color="white">
            {stage.name}
          </Typography>
        </Box>

        {rotationComponent()}
      </Stack>
    </Box>
  );
}
