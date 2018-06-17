module.exports = function SpokeoDriver(OptOut, Nightmare){
  let driver = {};

  driver.options = {};
  driver.options.captcha = true;
  driver.enabled = false;

  driver.urls = {};
  driver.urls.searchPage = "https://www.spokeo.com";
  driver.selectors = {};
  driver.selectors.searchForm = `#homepage_hero_form`;
  driver.selectors.searchFormFirstName = `.homepage_hero_search_box [name='q']`;
  driver.selectors.searchFormLastName = driver.selectors.searchFormFirstName;
  driver.selectors.searchFormButton = `#search`;
  driver.selectors.waitAfterSearch = ".listview_header_section_title";
  driver.selectors.eachProfileOnSearchPage = `.listview_section`;
  driver.selectors.eachProfileSynopsisLocation = '.current_location_row';


  return driver;
};