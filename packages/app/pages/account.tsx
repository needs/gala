import { ArrowBack, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  CssBaseline,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { trpc } from '../utils/trpc';
import { withAuth } from '../lib/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const updateUser = trpc.updateUser.useMutation();
  const { data: user, refetch: refetchUser } = trpc.user.useQuery(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserName(user?.name ?? '');
  }, [user]);

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
            Mon compte
          </Typography>
        </Stack>

        <TextField
          label="Nom"
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
          placeholder="Nom"
        />

        <Stack direction="row" gap={2} justifyContent="space-between">
          <Link href="/" legacyBehavior>
            <Button variant="outlined" startIcon={<ArrowBack />}>
              Précédent
            </Button>
          </Link>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => {
              updateUser
                .mutateAsync({
                  name: userName,
                })
                .then(() => {
                  refetchUser();
                });
            }}
          >
            Sauvegarder
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export const getServerSideProps = withAuth({});
