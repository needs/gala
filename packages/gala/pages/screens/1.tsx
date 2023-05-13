import { ref } from 'firebase/database';
import {
  database,
} from '../../lib/database';
import Screen from '../../components/Screen';

const progressRef = ref(database, 'progress');

export default function Screen1() {
  return (
    <Screen stageName="Plateau A" progressRef={progressRef} />
  );
}
