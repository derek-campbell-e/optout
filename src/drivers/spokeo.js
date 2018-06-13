module.exports = function SpokeoDriver(OptOut, Nightmare){
  let driver = {};

  driver.options = {};
  driver.options.captcha = true;

  driver.urls = {};
  driver.urls.searchPage = "https://www.spokeo.com";
  driver.selectors = {};
  driver.selectors.searchForm = `#homepage_hero_form`;
  driver.selectors.searchFormFirstName = `.homepage_hero_search_box [name='q']`;
  driver.selectors.searchFormLastName = driver.selectors.searchFormFirstName;
  driver.selectors.searchFormButton = `#search`;
  driver.selectors.waitAfterSearch = ".listview_header_section_title";
  driver.selectors.eachProfileOnSearchPage = `div a.listview_section`;
  driver.selectors.eachProfileSynopsisLocation = '.current_location_row';

  driver.locateProfiles = function(person, session, callback){
    OptOut.searchPagesWithJavascript(person, driver, session, function(result){
      console.log(result);
      callback();
    });
  };
  
  driver.discover = function(person, callback){
    let session = Nightmare.goto(driver.urls.searchPage).wait(driver.selectors.searchForm);
    if(driver.selectors.searchFormFirstName === driver.selectors.searchFormLastName){
      session.type(driver.selectors.searchFormFirstName, OptOut.fullName(person));
    } else {
      session.type(driver.selectors.searchFormFirstName, person.firstName)
        .type(driver.selectors.searchFormLastName, person.lastName);
    }
    session
      .click(driver.selectors.searchFormButton)
      .wait(driver.selectors.waitAfterSearch);
    driver.locateProfiles(person, session, callback);
  };

  driver.saveProfiles = function(profiles, callback){
    callback(profiles);
  };

  driver.decideAutoOptOut = function(profiles, callback){
    callback();
  };
  
  driver.routine = function(person, callback){
    OptOut.profiles[this.driver] = OptOut.profiles[this.driver] || {};
    console.log("starting spokeo driver...");
    driver.discover(person, function(profiles){
      driver.saveProfiles(profiles, function(){
        driver.decideAutoOptOut(profiles, function(){
          callback();
        });
      });
    });
    //callback();
  };

  return driver;
};