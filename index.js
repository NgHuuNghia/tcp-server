var net = require("net");

// creates the server
var server = net.createServer();

//emitted when server closes ...not emitted until all connections closes.
server.on("close", function () {
  console.log("Server closed !");
});

// emitted when new client connects
server.on("connection", function (socket) {
  //this property shows the number of characters currently buffered to be written. (Number of characters is approximately equal to the number of bytes to be written, but the buffer may contain strings, and the strings are lazily encoded, so the exact number of bytes is not known.)
  //Users who experience large or growing bufferSize should attempt to "throttle" the data flows in their program with pause() and resume().

  console.log("Buffer size : " + socket.bufferSize);

  console.log("---------server details -----------------");

  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipAddr = address.address;
  console.log("Server is listening at port" + port);
  console.log("Server ip :" + ipAddr);
  console.log("Server is IP4/IP6 : " + family);

  var lPort = socket.localPort;
  var lAddr = socket.localAddress;
  console.log("Server is listening at LOCAL port" + lPort);
  console.log("Server LOCAL ip :" + lAddr);

  console.log("------------remote client info --------------");

  var rPort = socket.remotePort;
  var rAddr = socket.remoteAddress;
  var rFamily = socket.remoteFamily;

  console.log("REMOTE Socket is listening at port" + rPort);
  console.log("REMOTE Socket ip :" + rAddr);
  console.log("REMOTE Socket is IP4/IP6 : " + rFamily);

  console.log("--------------------------------------------");
  //var no_of_connections =  server.getConnections(); // synchronous version
  server.getConnections(function (error, count) {
    console.log("Number of concurrent connections to the server : " + count);
  });

  socket.setEncoding("utf8");

  socket.setTimeout(800000, function () {
    // called after timeout -> same as socket.on('timeout')
    // it just tells that socket timed out => its ur job to end or destroy the socket.
    // socket.end() vs socket.destroy() => end allows us to send final data and allows some i/o activity to finish before destroying the socket
    // whereas destroy kills the socket immediately irrespective of whether any i/o operation is going on or not...force destroy takes place
    console.log("Socket timed out");
  });

  socket.on("data", function (data) {
    var bread = socket.bytesRead;
    var bWrite = socket.bytesWritten;
    console.log("Bytes read : " + bread);
    console.log("Bytes written : " + bWrite);
    console.log("Data sent to server : " + data);

    //echo data
    var is_kernel_buffer_full = socket.write(data);
    if (is_kernel_buffer_full) {
      console.log(
        "Data was flushed successfully from kernel buffer i.e written successfully!"
      );
    } else {
      socket.pause();
    }
  });

  socket.on("drain", function () {
    console.log(
      "write buffer is empty now .. u can resume the writable stream"
    );
    socket.resume();
  });

  socket.on("error", function (error) {
    console.log("Error : " + error);
  });

  socket.on("timeout", function () {
    console.log("Socket timed out !");
    socket.end("Timed out!");
    // can call socket.destroy() here too.
  });

  socket.on("end", function (data) {
    console.log("Socket ended from other end!");
    console.log("End data : " + data);
  });

  socket.on("close", function (error) {
    var bread = socket.bytesRead;
    var bWrite = socket.bytesWritten;
    console.log("Bytes read : " + bread);
    console.log("Bytes written : " + bWrite);
    console.log("Socket closed!");
    if (error) {
      console.log("Socket was closed coz of transmission error");
    }
  });

  setTimeout(function () {
    var isDestroyed = socket.destroyed;
    console.log("Socket destroyed:" + isDestroyed);
    socket.destroy();
  }, 1200000);
});

// emits when any error occurs -> calls closed event immediately after this.
server.on("error", function (error) {
  console.log("Error: " + error);
});

//emits when server is bound with server.listen
server.on("listening", function () {
  console.log("Server is listening!");
});

server.maxConnections = 10;

//static port allocation
server.listen(3333);

// // for dynamic port allocation
// server.listen(function () {
//   var address = server.address();
//   var port = address.port;
//   var family = address.family;
//   var ipAddr = address.address;
//   console.log("Server is listening at port" + port);
//   console.log("Server ip :" + ipAddr);
//   console.log("Server is IP4/IP6 : " + family);
// });

var isListening = server.listening;

if (isListening) {
  console.log("Server is listening");
} else {
  console.log("Server is not listening");
}

setTimeout(function () {
  server.close();
}, 5000000);
