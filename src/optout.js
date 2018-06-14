module.exports = function OptOut(){
  let oo = {};
  let nightmare = require('./nightmare')(oo);
  oo.drivers = {};
  oo.profiles = {};

  oo.injectJQuery = function(session, callback){
    session.evaluate(function(){
      return window.jQuery !== "undefined" && typeof window.jQuery === "function";
    })
    .then(function(hasJQuery){
      if(hasJQuery){
        console.log("HAS JQUERY!!!");
        return callback(session);
      }
      session.inject('js', require('path').join(__dirname, '..', 'node_modules', 'jquery/dist/jquery.js'))
      .wait()
      .evaluate(function(){})
      .then(function(){
        return callback(session);
      });
    });
  };

  oo.searchPagesWithJavascript = function(person, driver, session, callback){
    oo.injectJQuery(session, function(){
      session
      .wait(1000)
      .evaluate(function(selectors, regex){
        let profileDOMs = $(selectors.eachProfileOnSearchPage);
        let profiles = [];
        let profileScrape = function(dom){
          let profile = {};
          if(selectors.eachProfileSynopsisLocation){
            profile.location = dom.find(selectors.eachProfileSynopsisLocation).text();
          }
          if(selectors.eachProfileSynopsisAge){
            profile.age = dom.find(selectors.eachProfileSynopsisAge).text();
          }
          let text = "";
          dom.children().each(function(i, e){
            text += $(e).text();
            text += " ";
          });
          profile.text = text;
          return profile;
        };
        profileDOMs.each(function(i, e){
          profiles.push(profileScrape($(e)));
        });
        return {needsNavigation: true, profiles: profiles, selectors: selectors};
      }, driver.selectors, driver.regex)
      .then(function(result){
        console.log(result.profiles);
        callback({result: result, profiles: []});
      });
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