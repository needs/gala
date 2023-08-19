import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Gender, genders } from '../lib/store';
import GenderIcon from './GenderIcon';

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
