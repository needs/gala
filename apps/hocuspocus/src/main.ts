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
  debounce: 5000,
  timeout: 60000,

  async onAuthenticate(data) {
    const { token: sessionCookie, documentName } = data;

    const user = await getUser(adminApp, prisma, sessionCookie);
    const role = await getRole(prisma, documentName, user);

    if (role !== 'EDITOR' && role !== 'OWNER') {
      data.connection.readOnly = true;
    }
  },

  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        const competition = await prisma.competition.findUnique({
          where: {
            uuid: documentName,
          },
        });

        if (competition === null) {
          return new Uint8Array();
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

server.listen();
