import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { Player } from "../lib/database";
import EditPlayerDialog from "./EditPlayerDialog";

export default function AddPlayerButton({ onAdd }: { onAdd: (player: Player) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditPlayerDialog
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={(player) => {
          onAdd(player);
          setOpen(false);
        }}
        player={{
          firstName: '',
          lastName: '',
          gender: 'man',
        }}
      />
      <IconButton onClick={() => setOpen(true)} size="small">
        <Add />
      </IconButton>
    </>
  );
}
