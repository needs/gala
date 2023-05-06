import { ref } from 'firebase/database';
import {
  database,
  playersSchema,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';

const teamsRef = ref(database, 'teams');
const playersRef = ref(database, 'players');

export function Teams() {
  const teams = useDatabaseValue(
    teamsRef,
    teamsSchema
  );
  const players = useDatabaseValue(
    playersRef,
    playersSchema
  );

  if (teams === undefined || players === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Teams</h1>
      <section>
        {Object.entries(teams).map(([uuid, team]) => (
          <article key={uuid}>
            <h2>{team.name}</h2>
            <ul>
              {team.members.map((playerKey) => (
                <li key={playerKey}>
                  {players[playerKey].firstName} {players[playerKey].lastName}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </>
  );
}

export default Teams;
