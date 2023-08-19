import { Avatar } from '@mui/material';
import { Gender } from '../lib/store';
import GenderIcon, { genderColor } from './GenderIcon';

export default function GenderAvatar({
  gender,
  size,
}: {
  gender: Gender;
  size?: number;
}) {
  const sx = { width: size, height: size, bgcolor: genderColor(gender) };

  return (
    <Avatar sx={sx}>
      <GenderIcon gender={gender} color="white"/>
    </Avatar>
  );
}
