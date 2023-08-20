import { Box, Button, CssBaseline, Stack, TextField, Typography } from '@mui/material';

export default function Index() {
  return (
    <Box
      minWidth="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{ backgroundImage: 'url("/background.svg")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <CssBaseline />

      <Stack gap={2} maxWidth="400px" marginTop="auto" marginBottom="auto" marginLeft="auto" marginRight="auto" padding={4} sx={{ backgroundColor: "white" }} borderRadius="10px">
        <Typography>Authentifiez vous ou créez un compte pour retrouver vos GALA.</Typography>
        <TextField required label="Email" variant="outlined" />
        <TextField
          required
          label="Mot de passe"
          variant="outlined"
          type="password"
        />
        <Stack direction="row" gap={2}>
          <Button variant="outlined" fullWidth>
            Inscription
          </Button>
          <Button variant="contained" fullWidth>
            Connexion
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
