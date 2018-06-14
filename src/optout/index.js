module.exports = function OptOut(){
  let oo = {};
  let nightmare = require('../nightmare')(oo);
  oo.drivers = {};
  oo.profiles = {};

  oo.injectJQuery = function(session, callback){
    session.evaluate(function(){
      return window.jQuery !== "undefined" && typeof window.jQuery === "function";
    })
    .then(function(hasJQuery){
      if(hasJQuery){
        return callback(session);
      }
      session.inject('js', require('path').join(__dirname, '../..', 'node_modules', 'jquery/dist/jquery.js'))
      .wait()
      .evaluate(function(){})
      .then(function(){
        return callback(session);
      });
    });
  };

  oo.nextSearchPage = function(person, driver, session, callback){
    session
      .click(driver.selectors.nextSearchPage)
      .wait(1000)
      .wait(driver.selectors.waitAfterSearch)
      .evaluate(function(){})
      .then(function(){
        console.log("NEXT PAGE");
        oo.searchPagesWithJavascript(person, driver, session, callback);
      });
  };

  oo.searchPagesWithJavascript = function(person, driver, session, callback){
    oo.injectJQuery(session, function(){
      session
      .wait(1000)
      .evaluate(function(selectors, person){
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
            text += "\n";
          });
          profile.text = text;
          profile.link = "aaaaa";
          
          if(selectors.eachProfileOnSearchPage === selectors.eachProfileLink){
            profile.link = dom.attr('href');
          } else {
            profile.link = dom.find(selectors.eachProfileLink).attr('href');
          }
          
          var willContinue = false;
          for(_location of person.locations){
            if(profile.text.indexOf(_location) !== -1){
              willContinue = true;
            }
            if(profile.text.indexOf(_location.split(",")[0]) !== -1){
              willContinue = true;
            }
          }
          if(!willContinue){
            return null;
          }
          return profile;
        };
        profileDOMs.each(function(i, e){
          let result = profileScrape($(e));
          if(result){
            profiles.push(result);
          }
        });
        let needsNavigation = profiles.length < 1;
        return {needsNavigation: needsNavigation, profiles: profiles};
      }, driver.selectors, person)
      .then(function(result){
        if(result.needsNavigation){
          return oo.nextSearchPage(person, driver, session, callback);
        }
        console.log(result);
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
      if(!driver.enabled){
        return loop();
      }
      let routine = require('./routine')(oo, nightmare, driver, loop);
     routine.run.call(scope, person);
    };
    loop();
  };

  let init = function(){
    oo.loadDrivers();
    oo.routine({
      firstName: 'Beth',
      lastName: 'Campbell',
      age: 58,
      locations: ['Riverside, CA', 'Lake Elsinore, CA']
    });
    return oo;
  };

  return init();
};