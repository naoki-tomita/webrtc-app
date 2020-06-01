const { Server } = require("ws");

const server = new Server({ port: 8080 });
/** @type {any[]} */
let connections = [];
/** @type {Map<any, any>} */
let sdps = new Map();
server.on("connection", connection => {
  connections.push(connection);
  console.log(connections.length);
  connection.on("message", e => {
    const data = JSON.parse(e);
    console.log(data.message, data.data.type);
    connections.filter(con => con !== connection).forEach(con => con.send(e));
  });
  connection.on("close", () => {
    connections = connections.filter(con => con !== connection);
    console.log(connections.length);
  });
});
