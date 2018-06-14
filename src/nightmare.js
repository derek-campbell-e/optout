module.exports = function Nightmare(OptOut){
  const Nightmare = require('nightmare');
  const nightmare = Nightmare({show: true, width: 1920, height: 1080});
  return nightmare;
};