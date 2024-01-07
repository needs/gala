import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import GenderIcon from './GenderIcon';
import { Gender, genders } from '@tgym.fr/core';

export default function GenderSelector({
  gender,
  onChange,
}: {
  gender: Gender;
  onChange: (gender: Gender) => void;
}) {
  return (
    <ToggleButtonGroup
      value={gender}
      exclusive
      onChange={(event, gender: Gender) => onChange(gender)}
      size="small"
    >
      {genders.map((gender) => (
        <ToggleButton value={gender} key={gender}>
          <GenderIcon gender={gender} />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
