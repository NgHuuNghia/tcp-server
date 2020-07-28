var net = require("net");

const clients = net.connect({ port: 3333, host: "192.168.1.10" }, () => {
  // 'connect' listener
  console.log("connected to server!");
  clients.write("world!\r\n");
});
clients.on("data", (data) => {
  console.log("GET DATA: ", data.toString());
  clients.end();
});
clients.on("end", () => {
  console.log("disconnected from server");
});
