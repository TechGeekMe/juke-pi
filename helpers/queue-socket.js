var socket = require('socket.io')
var io;
module.exports = {
  getConnection: function() {
    return io;
  },
  createConnection: function(server) {
      io = socket(server);
  }
};
