import { Avatar } from '@mui/material';
import GenderIcon, { genderColor } from './GenderIcon';
import { Gender } from '@tgym.fr/core';

export default function GenderAvatar({
  gender,
  size,
}: {
  gender?: Gender;
  size?: number;
}) {
  const sx = { width: size, height: size, bgcolor: genderColor(gender) };

  return (
    <Avatar sx={sx}>
      <GenderIcon gender={gender} color="white" />
    </Avatar>
  );
}
