import {
  Alert,
  Button,
  CircularProgress,
  CssBaseline,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirebaseAppAuth } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PublicCompetitionList from '../components/PublicCompetitionList';

function Verify({ onEmailVerified }: { onEmailVerified: () => void }) {
  const [disabled, setDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisabled(false);
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    // Firebase doesn't update emailVerified in real time, so we need to poll.
    const interval = setInterval(() => {
      const auth = getFirebaseAppAuth();

      if (auth.currentUser !== null) {
        auth.currentUser.reload().then(() => {
          if (auth.currentUser !== null && auth.currentUser.emailVerified) {
            onEmailVerified();
          }
        });
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [onEmailVerified]);

  return (
    <>
      {errorMessage !== undefined && (
        <Alert severity="error">{errorMessage}</Alert>
      )}

      {errorMessage === undefined && (
        <Alert severity="info">
          {
            "Un email de confirmation vous a été envoyé. Veuillez cliquer sur le lien dans l'email pour continuer."
          }
        </Alert>
      )}

      <Button
        onClick={() => {
          const auth = getFirebaseAppAuth();

          if (auth.currentUser !== null) {
            sendEmailVerification(auth.currentUser).catch((error) => {
              console.error(error);
              setErrorMessage(
                "Erreur lors de l'envoi de l'email de vérification. Veuillez réessayer."
              );
            });
          }
        }}
        disabled={disabled}
      >
        Renvoyer un email de vérification
      </Button>
    </>
  );
}

function Form({
  onUserCredential: onUserCredential,
}: {
  onUserCredential: (userCredential: UserCredential) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const auth = getFirebaseAppAuth();

        setErrorMessage(undefined);
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            onUserCredential(userCredential);
          })
          .catch((error) => {
            console.error(error);
            setErrorMessage('Email ou mot de passe incorrect.');
          });
      }}
    >
      <Stack gap={2}>
        <Typography>
          Authentifiez vous ou créez un compte pour retrouver vos compétitions
          de gymnastique.
        </Typography>
        {errorMessage !== undefined && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        <TextField
          required
          label="Email"
          variant="outlined"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          required
          label="Mot de passe"
          variant="outlined"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Stack
          direction="row"
          gap={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Link href="/reset-password" legacyBehavior>
            Mot de passe perdu ?
          </Link>
          <Stack direction="row" gap={2}>
            <Button
              variant="outlined"
              onClick={() => {
                const auth = getFirebaseAppAuth();

                setErrorMessage(undefined);
                createUserWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    onUserCredential(userCredential);
                  })
                  .catch((error) => {
                    console.error(error);
                    setErrorMessage(
                      'Échec de la création du compte. Veuillez réessayer.'
                    );
                  });
              }}
            >
              Inscription
            </Button>
            <Button type="submit" variant="contained">
              Connexion
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
}

export default function Index() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'verify' | 'loading'>(
    'loading'
  );

  useEffect(() => {
    const auth = getFirebaseAppAuth();

    auth.authStateReady().then(() => {
      if (auth.currentUser === null) {
        setStep('form');
      } else if (!auth.currentUser.emailVerified) {
        setStep('verify');
      } else {
        router.push('/');
      }
    });
  }, [router]);

  return (
    <Stack
    direction="column"
    gap={4}
    p={4}
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
        backgroundAttachment: 'fixed',
        overflowY: 'auto',
      }}
    >
      <CssBaseline />

      <PublicCompetitionList />

      <Stack
        gap={2}
        width="600px"
        padding={4}
        sx={{ backgroundColor: 'white' }}
        borderRadius="10px"
      >
        {step === 'loading' && <CircularProgress />}
        {step === 'form' && (
          <Form
            onUserCredential={(userCredential) => {
              if (userCredential.user.emailVerified) {
                router.push('/');
              } else {
                sendEmailVerification(userCredential.user);
                setStep('verify');
              }
            }}
          />
        )}
        {step === 'verify' && (
          <Verify
            onEmailVerified={() => {
              router.push('/');
            }}
          />
        )}
      </Stack>
    </Stack>
  );
}
