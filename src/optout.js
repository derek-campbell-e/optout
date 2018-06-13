module.exports = function OptOut(){
  let oo = {};
  let nightmare = require('./nightmare')(oo);
  oo.drivers = {};
  oo.profiles = {};

  oo.searchPagesWithJavascript = function(person, driver, session, callback){
    session
      .evaluate(function(){
        return {needsNavigation: true, profiles: []}
      })
      .then(function(result){
        callback({result: result, profiles: []});
      });
  };

  oo.fullName = function(person){
    return person.firstName + " " + person.lastName;
  };

  oo.loadDrivers = function(){
    const fs = require('fs');
    const path = require('path');
    let dir = path.join(__dirname, 'drivers');
    let files = fs.readdirSync(dir);
    let drivers = files.filter(function(item){
      let ext = path.extname(item);
      return ext === ".js";
    });

    for(let driver of drivers){
      let driverName = path.basename(driver, '.js');
      let driverRequire = {};
      try {
        driverRequire = require(path.join(dir, driverName))(oo, nightmare);
      } catch(error){
        console.log(error);
      }
      oo.drivers[driverName] = driverRequire;
    }
  };
  
  oo.routine = function(person){
    let driverKeys = Object.keys(oo.drivers);
    let loop = function(){
      let driverKey = driverKeys.shift();
      if(typeof driverKey === "undefined"){
        console.log("done");
        return;
      }
      let driver = oo.drivers[driverKey];
      let scope = {};
      scope.driver = driverKey;
      driver.routine.call(scope, person, loop);
    };
    loop();
  };

  let init = function(){
    oo.loadDrivers();
    oo.routine({
      firstName: 'Beth',
      lastName: 'Campbell'
    });
    return oo;
  };

  return init();
};