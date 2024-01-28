import { Hocuspocus } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { Logger } from "@hocuspocus/extension-logger";
import { getRole, getUser } from '@tgym.fr/auth';
import { prisma } from './prisma';
import { adminApp } from './firebase';
import { competitionSchema } from '@tgym.fr/core';

function getPort() {
  const port = process.env['PORT'];
  if (port === undefined) {
    return 1234;
  }
  return parseInt(port, 10);
}

const server = new Hocuspocus({
  timeout: 60000,

  async onAuthenticate(data) {
    const { token: sessionCookie, documentName } = data;

    // Those depends on Firebase under the hood and where a bit slow previously,
    // so keep monitoring them for some time.

    console.time('getUser');
    const user = await getUser(adminApp, prisma, sessionCookie);
    console.timeEnd('getUser');

    console.time('getRole');
    const role = await getRole(prisma, documentName, user);
    console.timeEnd('getRole');

    if (role !== 'EDITOR' && role !== 'OWNER') {
      data.connection.readOnly = true;
    }
  },

  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        const competition = await prisma.competition.update({
          where: {
            uuid: documentName,
          },
          data: {
            viewCount: {
              increment: 1,
            }
          },
          select: {
            data: true,
          }
        });

        if (competition === null) {
          throw new Error('Competition not found');
        }

        return Uint8Array.from(competition.data);
      },
      store: async ({ documentName, state, document }) => {
        const competition = competitionSchema.parse(
          document.getMap('competition').toJSON()
        );

        const teamCount = Object.values(competition.teams).length;
        const playerCount = Object.values(competition.players).length;
        const cumulativeDuration = Object.values(competition.stages)
          .map((stage) =>
            Object.values(stage.timeline).map(
              (timeline) => timeline.durationInMinutes
            )
          )
          .flat()
          .reduce((a, b) => a + b, 0);

        const name = competition.info.name;

        await prisma.competition.update({
          where: {
            uuid: documentName,
          },
          data: {
            data: state,
            name,
            teamCount,
            playerCount,
            cumulativeDuration,
          },
        });
      },
    }),
  ],
  port: getPort(),
});

// Temporary, for debugging weird latency on first connect.
server.enableMessageLogging();

server.listen();
