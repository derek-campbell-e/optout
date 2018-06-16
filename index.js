module.exports = require('./src/optout');
process.on('message', function(data){
  module.exports(data);
});