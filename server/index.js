const { Server } = require("ws");

const server = new Server({ port: 8080 });

/**
 *
 * @param {string} queryString
 */
function parseQuery(queryString) {
  return queryString.split("&")
    .map(it => it.split("="))
    .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {})
}

/** @type {any} */
const connections = {};
server.on("connection", (connection, req) => {
  /** @type {any} */
  const query = parseQuery((req.url || "").split("?")[1] || "");
  const ID = query.id;
  connections[ID] = connection;
  console.log(Object.keys(connections).length);

  connection.on("message", e => {
    const data = JSON.parse(e);
    Object.keys(connections).filter(id => id !== ID).forEach(id => connections[id].send(JSON.stringify({ id: ID, data })));
  });
  connection.on("close", () => {
    delete connections[ID];
    connection.removeAllListeners();
    console.log(Object.keys(connections).length);
  });
});
