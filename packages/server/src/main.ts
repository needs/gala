import { Hocuspocus } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { getRole, getUser } from "@tgym.fr/auth";
import { prisma } from "./prisma";
import { adminApp } from "./firebase";

function getPort() {
  const port = process.env["PORT"];
  if (port === undefined) {
    return 1234;
  }
  return parseInt(port, 10);
}

const server = new Hocuspocus({
  debounce: 5000,

  async onAuthenticate(data) {
    const { token: sessionCookie, documentName } = data;

    const user = await getUser(adminApp, prisma, sessionCookie);
    const role = await getRole(prisma, documentName, user);

    if (role !== "EDITOR" && role !== "OWNER") {
      data.connection.readOnly = true;
    }
  },

  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const competition = await prisma.competition.findUnique({
          where: {
            uuid: documentName
          },
        });

        if (competition === null) {
          return new Uint8Array();
        }

        return Uint8Array.from(competition.data);
      },
      store: async ({ documentName, state, document }) => {
        const teamCount = document.getMap("teams").size;
        const name = document.getMap("info").get("name") ?? "";

        await prisma.competition.update({
          where: {
            uuid: documentName
          },
          data: {
            data: state,
            name,
            teamCount,
          },
        });
      },
    }),
  ],
  port: getPort(),
});

server.listen();
