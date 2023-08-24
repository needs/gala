import { Add, EmojiEvents } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { withAuth } from '../lib/auth';
import { useCookies } from 'react-cookie';
import Link from 'next/link';

export default function ListPage() {
  const create = trpc.create.useMutation();
  const { data: galas } = trpc.list.useQuery(null);
  const router = useRouter();
  const [cookies, setCookies, removeCookies] = useCookies(['session']);

  return (
    <Box
      minWidth="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: 'url("/background.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CssBaseline />

      <Stack
        gap={2}
        width="600px"
        padding={4}
        sx={{ backgroundColor: 'white' }}
        borderRadius="10px"
      >
        <Stack
          direction="row"
          gap={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" component="h1">
            Vos GALAs
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              create.mutateAsync(null).then((gala) => {
                router.push(`/gala/${gala.uuid}/teams`);
              });
            }}
          >
            Créer un GALA
          </Button>
        </Stack>
        <List>
          {galas !== undefined && galas.length === 0 && (
            <ListItem disablePadding>
              <ListItemText
                primary="Vous n'avez pas encore créé de GALA"
                secondary="Cliquez sur le bouton ci-dessus pour en créer un"
              />
            </ListItem>
          )}
          {galas !== undefined &&
            galas.length > 0 &&
            galas.map((gala) => (
              <Link key={gala.uuid} href={`/gala/${gala.uuid}/teams`} legacyBehavior>
              <ListItem disablePadding>
                <ListItemButton

                >
                  <ListItemAvatar>
                    <Avatar>
                      <EmojiEvents />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="GALA de l'Arbresle"
                    secondary={`${gala.teamCount} équipes`}
                  />
                </ListItemButton>
              </ListItem>
              </Link>
            ))}
        </List>

        <Button
          onClick={() => {
            removeCookies('session');
            signOut(auth).then(() => {
              router.push('/login');
            });
          }}
          color="secondary"
        >
          Deconnexion
        </Button>
      </Stack>
    </Box>
  );
}

export const getServerSideProps = withAuth({});
