import { Wc, Woman, Man } from "@mui/icons-material";
import { Gender, Player } from "../lib/database";

export default function GenderIcon({ gender, size }: { gender: Gender, size?: number }) {
  switch (gender) {
    case 'woman':
      return (
        <Woman sx={{ '&&': { color: 'pink', width: size, height: size } }} />
      );
    case 'man':
      return (
        <Man sx={{ '&&': { color: 'lightblue', width: size, height: size } }} />
      );
    case 'mixed':
      return (
        <Wc sx={{ width: size, height: size}} />
      );
  }
}
