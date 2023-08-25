import { Hocuspocus } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { getRole, getUser } from "@gala/auth";
import { prisma } from "./prisma";

const server = new Hocuspocus({
  debounce: 5000,

  async onAuthenticate(data) {
    const { token: sessionCookie, documentName } = data;

    const user = await getUser(sessionCookie);
    const role = await getRole(documentName, user);

    if (role !== "EDITOR" && role !== "OWNER") {
      data.connection.readOnly = true;
    }
  },

  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const gala = await prisma.gala.findUnique({
          where: {
            uuid: documentName
          },
        });

        if (gala === null) {
          return new Uint8Array();
        }

        return Uint8Array.from(gala.data);
      },
      store: async ({ documentName, state, document }) => {
        const teamCount = document.getMap("teams").size;
        const name = document.getMap("info").get("name") ?? "";

        await prisma.gala.update({
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
  port: 1234,
});

server.listen();
