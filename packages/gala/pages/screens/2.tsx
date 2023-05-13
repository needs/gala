import { ref } from 'firebase/database';
import {
  database,
} from '../../lib/database';
import Screen from '../../components/Screen';

const progressRef = ref(database, 'progress2');

export default function Screen2() {
  return (
    <Screen stageName="Plateau B" progressRef={progressRef} />
  );
}
