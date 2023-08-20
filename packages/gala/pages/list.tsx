import { Add, EmojiEvents, Inbox } from '@mui/icons-material';
import { Avatar, Box, Button, CssBaseline, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Stack, TextField, Typography } from '@mui/material';

export default function Index() {
  return (
    <Box
      minWidth="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundImage: 'url("/background.svg")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <CssBaseline />

      <Stack gap={2} width="600px" padding={4} sx={{ backgroundColor: "white" }} borderRadius="10px">
        <Stack direction="row" gap={2} justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="h1">Vos GALAs</Typography>
          <Button variant="contained" startIcon={<Add />}>
            Créer un GALA
          </Button>
        </Stack>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar>
                  <EmojiEvents />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="GALA de l'Arbresle" secondary="140 équipes" />
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
    </Box>
  );
}
