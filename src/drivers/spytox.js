module.exports = function SpyToxDriver(OptOut, Nightmare){
  let driver = {};

  driver.enabled = true;
  driver.options = {};
  driver.options.captcha = true;
  driver.options.hasGETSearchURL = true;

  driver.urls = {};
  driver.urls.searchPage = "www.checkthem.com/";
  driver.urls.getSearchURL = function(person){
    return `https://www.spytox.com/${person.firstName}-${person.lastName}`;
  };

  driver.selectors = {};
  driver.selectors.searchForm = `#homepage_hero_form`;
  driver.selectors.searchFormFirstName = `.homepage_hero_search_box [name='q']`;
  driver.selectors.searchFormLastName = driver.selectors.searchFormFirstName;
  driver.selectors.searchFormButton = `#search`;
  driver.selectors.waitAfterSearch = ".report-state-wrapper";
  driver.selectors.eachProfileOnSearchPage = `.report-state-wrapper .single-person`;
  driver.selectors.eachProfileSynopsisLocation = '.addresses';
  //driver.selectors.nextSearchPage = '.pagination .pagination_item:last-child';
  driver.selectors.eachProfileLink = '.person a';
  driver.selectors.optout = {};
  driver.selectors.optout.profileField = `form [name='url']`;
  driver.selectors.optout.submitButton = `form [value="Remove My Info"]`;


  driver.selectors.alternate = {};
  driver.selectors.alternate.eachProfileOnSearchPage = '.listview_section';
  

  return driver;
};