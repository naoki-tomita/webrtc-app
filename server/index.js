const { Server } = require("ws");

const server = new Server({ port: 8080 });
/** @type {any[]} */
let connections = [];
/** @type {Map<any, any>} */
let offers = new Map();
server.on("connection", connection => {
  connections.push(connection);
  console.log(connections.length);

  console.log("already connections: ", offers.size);
  [...offers.values()].forEach(offer => {
    console.log(offer);
    connection.send(offer)
  });

  connection.on("message", e => {
    const data = JSON.parse(e);
    console.log(data.message, data.data.type);
    if (data.data.type === "offer") {
      offers.set(connection, e);
    }
    connections.filter(con => con !== connection).forEach(con => con.send(e));
  });
  connection.on("close", () => {
    connections = connections.filter(con => con !== connection);
    offers.delete(connection);
    connection.removeAllListeners();
    console.log(connections.length);
  });
});
