module.exports = function Nightmare(OptOut){
  const Nightmare = require('nightmare');
  const nightmare = Nightmare({show: true, width: 1200, height: 900});
  return nightmare;
};