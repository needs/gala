import { withAuthGala } from '../../../lib/auth';
import { useGala } from '../../../lib/store';
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import { Add, SportsBar } from '@mui/icons-material';
import { nanoid } from 'nanoid';
import TvFrame from '../../../components/TvFrame';

export default function ScreensPage() {
  const { screens } = useGala();

  return (
      <Stack
        direction="row"
        padding={4} gap={4}
        flexWrap="wrap"
        justifyContent="space-evenly"
      >
        {Object.entries(screens).map(([screenKey, screen]) => (
          <TvFrame key={screenKey} height={200} width={300}>
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              justifyContent="center"
              height="100%"
              bgcolor="white"
              sx={{
                backgroundImage: 'url("/tv-background.svg")',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <SportsBar fontSize="large" />
              <Stack direction="column">
                <Typography variant="body1">Buvette principale</Typography>
                <Typography variant="caption" color="">
                  Buvette
                </Typography>
              </Stack>
            </Stack>
          </TvFrame>
        ))}
          <Stack
            height={200}
            width={300}
            sx={{
              borderRadius: 2,
              borderStyle: 'dashed',
              borderWidth: 4,
              borderColor: 'grey.300',
              bgcolor: 'grey.100',
              color: 'grey.600',
              cursor: 'pointer',
            }}
            justifyContent="center"
            alignItems="center"

            onClick={() => {
              screens[nanoid()] = {
                type: 'bar',
                name: 'Nouvel écran',
              }
            }}
          >
            <Add fontSize='large'/>
            <Typography variant="h5" component="span">Ajouter un écran</Typography>
          </Stack>
      </Stack>
  );
}

export const getServerSideProps = withAuthGala('screens');
