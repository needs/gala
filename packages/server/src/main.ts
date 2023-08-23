import { Hocuspocus } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { PrismaClient } from '@prisma/client'
import { getRole, getUser } from "@gala/auth";

const prisma = new PrismaClient();

const server = new Hocuspocus({
  debounce: 5000,

  async onAuthenticate(data) {
    const { token, documentName } = data;

    const user = await getUser(token);
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
      store: async ({ documentName, state }) => {
        await prisma.gala.update({
          where: {
            uuid: documentName
          },
          data: {
            data: state
          },
        });
      },
    }),
  ],
  port: 1234,
});

server.listen();
