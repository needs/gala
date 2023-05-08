import { Girl, Boy, Wc } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { Gender } from "../lib/database";

export default function GenderAvatar({ gender, size }: { gender: Gender, size?: number }) {
  const sx = { width: size, height: size };

  switch (gender) {
    case 'woman':
      return (
        <Avatar sx={{ ...sx, bgcolor: 'pink' }}>
          <Girl />
        </Avatar>
      );
    case 'man':
      return (
        <Avatar sx={{ ...sx, bgcolor: 'lightblue' }}>
          <Boy />
        </Avatar>
      );
    case 'mixed':
      return (
        <Avatar sx={sx}>
          <Wc />
        </Avatar>
      );
  }
}
