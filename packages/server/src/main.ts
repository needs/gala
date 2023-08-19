import { Hocuspocus } from "@hocuspocus/server";
import { SQLite } from "@hocuspocus/extension-sqlite";

const server = new Hocuspocus({
  extensions: [
    new SQLite({
      database: "db.sqlite",
    }),
  ],
  port: 1234,
});

server.listen();
