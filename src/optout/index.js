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

  oo.injectSimilarity = function(session, callback){
    console.log("INJECTING");
    session.evaluate(function(){
      return typeof window.stringSimilarity !== "undefined";
    })
    .then(function(hasSimilarity){
      console.log(hasSimilarity);
      if(hasSimilarity){
        return callback(session);
      }
      console.log(require('path').join(__dirname, '../..', 'similarity-web.js'));
      session.inject('js', require('path').join(__dirname, '../..', 'similarity-web.js'))
      .wait()
      .evaluate(function(){})
      .then(function(){
        return callback(session);
      });
    });
  };

  oo.injectJQuery = function(session, callback){
    oo.injectSimilarity(session, function(){
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
      .evaluate(function(selectors, funcs, person){
        funcs = funcs || {};
        let replaceWhiteSpace = function(string){
          let copy = string;
          copy = copy.replace(/(\s{2,}|\n)/g, " ");
          copy = copy.trim();
          return copy;
        };
        let profileDOMs = $(selectors.eachProfileOnSearchPage);
        let profiles = [];
        let profileScrape = function(dom){
          let profile = {};
          profile.link = null;

          if(selectors.eachProfileSynopsisLocation){
            profile.location = dom.find(selectors.eachProfileSynopsisLocation).text();
            profile.location = replaceWhiteSpace(profile.location);
          }

          if(funcs.eachProfileSynopsisLocation){
            let args = funcs.eachProfileSynopsisLocation.args;
            args.push(funcs.eachProfileSynopsisLocation.func);
            let func = Function.apply(window, args);
            let result = func(dom.find(selectors.eachProfileSynopsisLocation));
            profile.location = result;
          }


          if(selectors.eachProfileSynopsisAge){
            profile.age = dom.find(selectors.eachProfileSynopsisAge).text();
            profile.age = replaceWhiteSpace(profile.age);
          }
      
          let text = "";
          dom.children().each(function(i, e){
            text += $(e).text();
            text += "\n";
          });
          profile.text = replaceWhiteSpace(text);
          
          
          if(selectors.eachProfileOnSearchPage === selectors.eachProfileLink){
            profile.link = dom.attr('href');
          } else {
            profile.link = dom.find(selectors.eachProfileLink).attr('href');
          }
          
          if(profile.link){
            profile.link = new URL(profile.link, window.location.href).href;
          }
          
          var willContinue = false;
          if(typeof person.locations === "undefined"){
            person.locations = [];
          }
          for(_location of person.locations){
            if(profile.text.indexOf(_location) !== -1){
              willContinue = true;
            }
            if(profile.text.indexOf(_location.split(",")[0]) !== -1){
              willContinue = true;
            }
            for(_loc of profile.location){
              if(stringSimilarity.compareTwoStrings(_location, _loc) > 0.5){
                willContinue = true;
              }
            }
          }
          if(!willContinue){
            return null;
          }
          return profile;
        };
        profileDOMs.each(function(i, e){
          if($(e).is(selectors.notEachProfileOnSearchPage)){
            return;
          }
          let result = profileScrape($(e));
          if(result){
            profiles.push(result);
          }
        });
        
        let canNavigate = typeof selectors.nextSearchPage !== "undefined" && $(selectors.nextSearchPage).length !== 0;
        let satisfiedProfiles = profiles.length > 1;
        let needsNavigation = false;
        if(satisfiedProfiles){
          needsNavigation = false;
        }
        if(canNavigate && !satisfiedProfiles){
          needsNavigation = true;
        }
        return {needsNavigation: needsNavigation, profiles: profiles};
      }, driver.selectors, driver.funcs, person)
      .then(function(result){
        console.log(result);
        if(result.needsNavigation && driver.selectors.nextSearchPage){
          return oo.nextSearchPage(person, driver, session, callback);
        }
        console.log(result);
        callback(result);
      })
      .catch(function(error){
        console.log(error);
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
      driverRequire.name = driverName;
      oo.drivers[driverName] = driverRequire;
    }
  };
  
  oo.routine = function(person){
    let driverKeys = Object.keys(oo.drivers);
    console.log(driverKeys);
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
      console.log(error);
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