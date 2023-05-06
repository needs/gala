import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import { z } from 'zod';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  databaseURL:
    'https://gala-8700f-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const teamsSchema = z.record(
  z.string(),
  z.object({
    members: z.array(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
      })
    ),
  })
);

export function Teams() {
  const [teams, setTeams] = useState<z.infer<typeof teamsSchema> | undefined>(
    undefined
  );

  useEffect(() => {
    const teamsRef = ref(database, 'teams');

    onValue(teamsRef, (snapshot) => {
      const val = snapshot.val();

      if (val === null) {
        setTeams({});
      } else {
        setTeams(teamsSchema.parse(val));
      }
    });
  }, []);

  return (
    <>
      <h1>Teams</h1>
      <section>
        {teams &&
          Object.entries(teams).map(([teamName, team]) => (
            <article key={teamName}>
              <h2>{teamName}</h2>
              <ul>
                {team.members.map((member, index) => (
                  <li key={index}>
                    {member.firstName} {member.lastName}
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
