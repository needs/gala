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
  const [cookies, setCookies, removeCookies] = useCookies(['session']);
  const router = useRouter();
  const create = trpc.create.useMutation();
  const { data: galas } = trpc.list.useQuery(null);

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
            Vos compétitions
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              create.mutateAsync(null).then((gala) => {
                router.push(`/gala/${gala.uuid}`);
              });
            }}
          >
            Compétition
          </Button>
        </Stack>
        <List>
          {galas !== undefined && galas.length === 0 && (
            <ListItem disablePadding>
              <ListItemText
                primary="Vous n'avez pas encore créé de compétition"
                secondary="Cliquez sur le bouton ci-dessus pour en créer un"
              />
            </ListItem>
          )}
          {galas !== undefined &&
            galas.length > 0 &&
            galas.map((gala) => (
              <Link key={gala.uuid} href={`/gala/${gala.uuid}`} legacyBehavior>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar>
                        <EmojiEvents />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={gala.name ? gala.name : 'Compétition sans nom'}
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
