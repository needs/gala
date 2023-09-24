import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CssBaseline,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';

export default function ListPage() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [isSuccess, setIsSuccess] = useState(false);

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
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          sendPasswordResetEmail(auth, email)
            .then(() => {
              setIsSuccess(true);
            })
            .catch((error) => {
              if (error.code === 'auth/user-not-found') {
                setErrorMessage(
                  "Aucun compte n'est associé à cette adresse email."
                );
              } else if (error.code === 'auth/invalid-email') {
                setErrorMessage('Adresse email invalide');
              } else {
                console.error(error);
                setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
              }
            });
        }}
      >
        <Stack
          gap={2}
          width="600px"
          padding={4}
          sx={{ backgroundColor: 'white' }}
          borderRadius="10px"
        >
          {!isSuccess && (
            <Typography>
              Une fois votre adresse email renseignée, vous recevrez un email
              vous permettant de réinitialiser votre mot de passe.
            </Typography>
          )}
          {errorMessage !== undefined && (
            <Alert severity="error">{errorMessage}</Alert>
          )}
          {isSuccess && (
            <Alert severity="success">
              <AlertTitle>Un email a été envoyé</AlertTitle>
              {
                "Suivez les instructions dans l'email pour réinitialiser votre mot de passe."
              }
            </Alert>
          )}
          {!isSuccess && (
            <TextField
              required
              label="Email"
              variant="outlined"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          )}
          <Stack direction="row" gap={2} justifyContent="space-between">
            <Link href="/login" legacyBehavior>
              <Button variant="outlined" startIcon={<ArrowBack />}>
                Retour
              </Button>
            </Link>
            {!isSuccess && (
              <Button type="submit" variant="contained" color="primary">
                Réinitialiser
              </Button>
            )}
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}
