module.exports = function Routine(OptOut, Nightmare, Driver, Callback){
  let routine = {};
  let error = null;

  routine.run = function(person){
    routine.discover(person);
  };

  routine.discover = function(person){
    if(Driver.options.hasGETSearchURL){
      let url = Driver.urls.getSearchURL(person);
      let session = Nightmare
        .goto(url)
        .wait(Driver.selectors.waitAfterSearch);
      session
        .evaluate(function(){})
        .then(function(){
          console.log("DISCOVER");
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

  routine.locateProfiles = function(person, session){
    OptOut.searchPagesWithJavascript(person, Driver, session, function(result){
      routine.saveProfiles(result);
    });
  };

  routine.saveProfiles = function(profiles){
    routine.decideAutoOptOut(Driver, profiles, function(optResults){
      Callback(error, optResults);
    });
  };

  routine.decideAutoOptOut = function(Driver, Profiles, callback){
    callback(null);
  };

  let init = function(){
    OptOut.profiles[this.driver] = OptOut.profiles[this.driver] || {};
    return routine;
  };

  return init();
};