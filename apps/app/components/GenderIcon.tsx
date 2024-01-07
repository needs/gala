import { Wc, Woman, Man, QuestionMark } from '@mui/icons-material';
import { Gender } from '@tgym.fr/core';

export function genderColor(gender: Gender | undefined) {
  switch (gender) {
    case 'woman':
      return 'pink';
    case 'man':
      return 'lightblue';
    case 'mixed':
      return 'grey';
    case undefined:
      return 'grey';
  }
}

export default function GenderIcon({
  gender,
  size,
  color: iconColor,
}: {
  gender?: Gender;
  size?: number;
  color?: string;
}) {
  const color = iconColor ?? genderColor(gender);

  const sx = { '&&': { color, width: size, height: size } };

  switch (gender) {
    case 'woman':
      return <Woman sx={sx} />;
    case 'man':
      return <Man sx={sx} />;
    case 'mixed':
      return <Wc sx={sx} />;
    case undefined:
      return <QuestionMark sx={sx} />;
  }
}
