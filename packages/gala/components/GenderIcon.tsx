import { Wc, Woman, Man } from '@mui/icons-material';
import { Gender } from '../lib/store';

export function genderColor(gender: Gender) {
  switch (gender) {
    case 'woman':
      return 'pink';
    case 'man':
      return 'lightblue';
    case 'mixed':
      return 'grey';
  }
}

export default function GenderIcon({
  gender,
  size,
  color: iconColor,
}: {
  gender: Gender;
  size?: number;
  color?: string;
}) {
  const color = iconColor ?? genderColor(gender);

  const sx = { '&&': { color, width: size, height: size } }

  switch (gender) {
    case 'woman':
      return (
        <Woman sx={sx} />
      );
    case 'man':
      return (
        <Man sx={sx} />
      );
    case 'mixed':
      return <Wc sx={sx} />;
  }
}
