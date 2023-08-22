import {
  Alert,
  Box,
  Button,
  CssBaseline,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  getIdToken,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { cookies } from 'next/dist/client/components/headers';
import { useCookies } from 'react-cookie';

function Success() {
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    router.push('/');

    const timeout = setTimeout(() => {
      setDisabled(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <>
      <Alert severity="success">
        {
          "Redirection vers l'application en cours. Si la redirection ne fonctionne pas, veuillez cliquer sur le bouton ci-dessous."
        }
      </Alert>
      <Button href="/" disabled={disabled}>
        Redirection
      </Button>
    </>
  );
}

function VerifyEmail() {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisabled(false);
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <Alert severity="info">
        {
          "Un email de confirmation vous a été envoyé. Veuillez cliquer sur le lien dans l'email pour continuer."
        }
      </Alert>

      <Button
        onClick={() => {
          if (auth.currentUser !== null) {
            sendEmailVerification(auth.currentUser);
          }
        }}
        disabled={disabled}
      >
        Renvoyer un email de vérification
      </Button>
    </>
  );
}

function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const validateUser = (userCredential: UserCredential) => {
    const user = userCredential.user;
    if (!user.emailVerified) {
      sendEmailVerification(user).catch((error) => {
        setErrorMessage(error.message);
      });
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <Typography>
        Authentifiez vous ou créez un compte pour retrouver vos GALA de
        gymnastique.
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
      <Stack direction="row" gap={2}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            setErrorMessage(undefined);
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                validateUser(userCredential);
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          }}
        >
          Inscription
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            setErrorMessage(undefined);
            signInWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                validateUser(userCredential);
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          }}
        >
          Connexion
        </Button>
      </Stack>
    </>
  );
}

export default function Index() {
  const [step, setStep] = useState<'login' | 'verify' | 'success'>('login');
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user === null) {
        setStep('login');
        removeCookie('token');
      } else if (!user.emailVerified) {
        setStep('verify');
      } else {
        setStep('success');
        setCookie('token', await getIdToken(user), {
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (step === 'verify') {
      const interval = setInterval(() => {
        if (auth.currentUser !== null) {
          auth.currentUser.reload();
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      }
    }
  }, [step]);

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
        {step === 'login' && <Login />}
        {step === 'verify' && <VerifyEmail />}
        {step === 'success' && <Success />}
      </Stack>
    </Box>
  );
}
