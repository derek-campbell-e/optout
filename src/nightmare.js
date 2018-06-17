module.exports = function Nightmare(OptOut){
  const Nightmare = require('nightmare');
  const nightmare = Nightmare({show: true, "x":-1885,"y":76,"width":1866,"height":800, waitTimeout: 1000 * 60 * 1000});
  return nightmare;
};