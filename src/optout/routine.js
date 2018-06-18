module.exports = function Routine(OptOut, Nightmare, Driver, Callback){
  let routine = {};
  let error = null;

  routine.run = function(person){
    let fullName = OptOut.fullName(person);
    OptOut.profiles[fullName] = OptOut.profiles[fullName] || {};
    OptOut.profiles[fullName].sites = OptOut.profiles[fullName].sites || {};
    OptOut.profiles[fullName].information = OptOut.profiles[fullName].information || {};
    let profile = OptOut.profiles[fullName];
    profile.information = person;
    routine.discover(person);
  };

  // start the profile searching process
  // TODO: impliment options for sites that have a better / only have search for opt-out protocol
  routine.discover = function(person){
    if(Driver.options.hasGETSearchURL){
      let url = Driver.urls.getSearchURL(person);
      let session = Nightmare
        .goto(url)
        .wait(Driver.selectors.waitAfterSearch);
      session
        .evaluate(function(){})
        .then(function(){
          routine.locateProfiles(person, session)
        })
      return;
    }
    
    let session = Nightmare.goto(Driver.urls.searchPage).wait(Driver.selectors.searchForm);
    if(Driver.selectors.searchFormFirstName === Driver.selectors.searchFormLastName){
      session.type(Driver.selectors.searchFormFirstName, OptOut.fullName(person));
    } else {
      session.type(Driver.selectors.searchFormFirstName, person.firstName)
        .type(Driver.selectors.searchFormLastName, person.lastName);
    }
    session
      .click(Driver.selectors.searchFormButton)
      .wait(Driver.selectors.waitAfterSearch)
      .evaluate(function(){})
      .then(function(){
        routine.locateProfiles(person, session);
      });
  };

  // run javascript on the pages to see if each profile reasonably matches input information
  // does this by injecting jquery and running custom functions and extracting profile information
  // also will navigate to the next page if need be
  routine.locateProfiles = function(person, session){
    routine.searchPagesWithJavascript(person, Driver, session, function(result){
      routine.saveProfiles(person, result.profiles);
    });
  };

  routine.searchPagesWithJavascript = function(person, driver, session, callback){
    routine.injectJSDependencies(session, function(){
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
        
        let createCustomFunction = function(args, funcText){
          let _args = args.slice();
          _args.push(funcText);
          let func = Function.apply(window, _args);
          return func;
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

          for(let funcKey in funcs){
            let funcObject = funcs[funcKey];
            if(!funcObject.hasOwnProperty('affects')){
              continue;
            }
            let func = createCustomFunction(funcObject.args, funcObject.func);
            let result = func(dom);
            profile[funcObject.affects] = result;
          }

          if(funcs.api){
            let func = createCustomFunction(funcs.api.args, funcs.api.func);
            let result = func(dom);
            profile.api = result;
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
          return routine.nextSearchPage(person, driver, session, callback);
        }
        console.log(result);
        callback(result);
      })
      .catch(function(error){
        console.log(error);
      });
    });
  };

  routine.injectJSDependencies = function(session, callback){
    routine.injectSimilarity(session, function(){
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

  routine.injectSimilarity = function(session, callback){
    console.log("INJECTING");
    session.evaluate(function(){
      return typeof window.stringSimilarity !== "undefined";
    })
    .then(function(hasSimilarity){
      if(hasSimilarity){
        return callback(session);
      }
      session.inject('js', require('path').join(__dirname, '../..', 'similarity-web.js'))
      .wait()
      .evaluate(function(){})
      .then(function(){
        return callback(session);
      });
    });
  };

  routine.nextSearchPage = function(person, driver, session, callback){
    session
      .click(driver.selectors.nextSearchPage)
      .wait(1000)
      .wait(driver.selectors.waitAfterSearch)
      .evaluate(function(selector){
        return $(selector).length;
      }, driver.selectors.nextSearchPage)
      .then(function(dom){
        console.log("NSEXT PAGE", dom);
        routine.searchPagesWithJavascript(person, driver, session, callback);
      });
  };

  routine.saveProfiles = function(person, profiles){
    console.log("GOT OUR PROFILES", profiles);
    let personProfile = OptOut.profiles[OptOut.fullName(person)];
    personProfile.sites[Driver.name] = profiles;
    OptOut.saveProfiles();
    routine.decideAutoOptOut(Driver, profiles, function(optResults){
      Callback(error, optResults);
    });
  };

  routine.decideAutoOptOut = function(Driver, Profiles, callback){
    console.log("HERE");
    callback(null);
  };

  let init = function(){
    OptOut.profiles[this.driver] = OptOut.profiles[this.driver] || {};
    return routine;
  };

  return init();
};