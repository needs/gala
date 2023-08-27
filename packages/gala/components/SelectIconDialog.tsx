import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ImageList,
  ImageListItem,
  TextField,
  Stack,
} from '@mui/material';
import * as Muicon from '@mui/icons-material';
import { useState } from 'react';

type Icon = keyof typeof Muicon;

const allIcons = Object.entries(Muicon).filter(([key]) =>
  key.includes('Outlined')
);

export default function SelectIconDialog({
  open,
  icon,
  onClose,
}: {
  open: boolean;
  icon: Icon;
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
          <ImageList sx={{ width: 500, height: 450 }} cols={10} rowHeight={32}>
            {allIcons
              .filter(([key]) =>
                key.toLowerCase().includes(lowerCaseSearchQuery)
              )
              .map(([key, Icon]) => {
                return (
                  <ImageListItem key={key} sx={{
                    cursor: 'pointer',
                    backgroundColor: icon === key ? 'primary.main' : undefined,
                  }}>
                    <Icon />
                  </ImageListItem>
                );
              })}
          </ImageList>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
