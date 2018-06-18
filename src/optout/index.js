module.exports = function OptOut(options){
  const path = require('path');
  const www = path.join(__dirname, '..', 'www');
  const express = require('express');
  const app = express();
  
  app.use('/', express.static(www));
  

  let oo = {};
  let nightmare = require('../nightmare')(oo);
  oo.drivers = {};
  oo.profiles = {};

  oo.functionCreator = function(driverFuncs, key, args, affects, func){
    let obj = {};
    obj.args = args;
    obj.func = func;
    if(affects){
      obj.affects = affects;
    }
    driverFuncs[key] = obj;
  };

  oo.fullName = function(person){
    return person.firstName + " " + person.lastName;
  };

  oo.loadDrivers = function(){
    const fs = require('fs');
    const path = require('path');
    let dir = path.join(__dirname, '..', 'drivers');
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
        continue;
      }
      driverRequire.name = driverName;
      oo.drivers[driverName] = driverRequire;
    }
  };
  
  oo.routine = function(person){
    let driverKeys = Object.keys(oo.drivers);
    console.log(driverKeys);
    let loop = function(){
      console.log("STARTING A LOOP")
      let driverKey = driverKeys.shift();
      if(typeof driverKey === "undefined"){
        console.log("done");
        return;
      }
      let driver = oo.drivers[driverKey];
      let scope = {};
      scope.driver = driverKey;
      if(!driver.enabled){
        return loop();
      }
      let routine = require('./routine')(oo, nightmare, driver, loop);
     routine.run.call(scope, person);
    };
    loop();
  };

  oo.formatOptions = function(options){
    let json = {};
    console.log(options);
    for(object of options){
      let key = object.name;
      json[object.name] = object.value;
      if(key === 'locations' || key === 'relatives'){
        let value = object.value;
        value = value.split("\n");
        json[key] = value;
      }
    }
    return json;
  };

  oo.loadIndex = function(){
    app.listen(8080, function(){
      console.log("LISTENING");
      let session = nightmare.goto('http://localhost:8080').wait(function(){
        return userOptions;
      }).evaluate(function(){
        return userOptions;
      }).then(function(options){
        console.log(options);
        oo.routine(oo.formatOptions(options))
      });
    });
  };

  oo.loadProfiles = function(){
    let basedir = path.join(__dirname, '..', '..');
    let profileRequire = path.join(basedir, 'profiles.json');
    oo.profiles = {};
    try {
      oo.profiles = require(profileRequire);
    } catch (error){
      //console.log(error);
    }
  };

  oo.saveProfiles = function(){
    let basedir = path.join(__dirname, '..', '..');
    let profileRequire = path.join(basedir, 'profiles.json');
    let json = JSON.stringify(oo.profiles, null, 4);
    require('fs').writeFileSync(profileRequire, json);
  };

  let init = function(){
    oo.loadProfiles();
    oo.loadDrivers();
    //oo.loadIndex();
    //oo.routine(oo.formatOptions());
    return oo;
  };

  return init();
};