module.exports = function Nightmare(OptOut){
  const Nightmare = require('nightmare');
  const nightmare = Nightmare({show: true, width: 1200, height: 800, waitTimeout: 1000 * 60 * 1000});
  return nightmare;
};