import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
} from '@mui/material';
import * as Muicon from '@mui/icons-material';
import { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';

export type Icon = keyof typeof Muicon;

const allIcons = Object.entries(Muicon).filter(([key]) =>
  key.includes('Outlined')
);

export default function SelectIconDialog({
  open,
  icon,
  onChange,
  onClose,
}: {
  open: boolean;
  icon: Icon | undefined;
  onChange: (icon: Icon) => void;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const lowerCaseSearchQuery = searchQuery.toLowerCase();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Selectionner une icône</DialogTitle>

      <DialogContent>
        <Stack gap={2}>
          <TextField
            autoFocus
            margin="dense"
            label="Rechercher une icône"
            type="text"
            fullWidth
            variant="standard"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <Box sx={{ width: 500, height: 450, overflowY: 'auto' }}>
            <Grid container>
              {allIcons
                .filter(([key]) =>
                  key.toLowerCase().includes(lowerCaseSearchQuery)
                )
                .map(([key, Icon]) => {
                  return (
                    <Grid
                      xs={1}
                      key={key}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor:
                          icon === key ? 'primary.main' : undefined,
                      }}

                      onClick={() => {
                        onChange(key as Icon);
                      }}
                    >
                      <Icon
                        sx={{
                          m: 'auto',
                        }}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
