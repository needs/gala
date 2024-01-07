import { Chip, Avatar } from '@mui/material';
import { useState } from 'react';
import { fullName } from '../lib/utils';
import EditPlayerDialog from './EditPlayerDialog';
import GenderIcon from './GenderIcon';
import { Player } from '@tgym.fr/core';

export default function EditPlayerButton({
  player,
  onDelete,
}: {
  player: Player;
  onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditPlayerDialog
        open={open}
        onClose={() => setOpen(false)}
        player={player}
      />
      <Chip
        avatar={
          <Avatar sx={{ bgcolor: 'transparent' }}>
            <GenderIcon gender={player.gender} />
          </Avatar>
        }
        onClick={(event) => setOpen(true)}
        label={fullName(player)}
        variant="outlined"
        onDelete={onDelete}
        sx={{
          '& .MuiChip-deleteIcon': {
            marginLeft: 'auto',
          },
        }}
      />
    </>
  );
}
