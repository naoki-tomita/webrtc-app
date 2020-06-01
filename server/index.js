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

  setTimeout(() => { connection.send(JSON.stringify({ type: "list", data: Object.keys(connections) })) })

  connection.on("message", e => {
    const message = JSON.parse(e);
    switch(message.type) {
      case "broadcast":
        Object.keys(connections).filter(id => id !== ID)
          .forEach(id => connections[id].send(JSON.stringify({ type: "broadcast", id: ID, data: message.data })));
        break;
      case "message":
        if (Object.keys(connections).includes(message.target)) {
          connections[message.target].send(JSON.stringify({ type: "message", id: ID, data: message.data }));
        }
        break;
    }
  });
  connection.on("close", () => {
    delete connections[ID];
    connection.removeAllListeners();
    console.log(Object.keys(connections).length);
  });
});
