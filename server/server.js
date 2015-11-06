var io = require('socket.io').listen(8080);



io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'hello world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  });

});
