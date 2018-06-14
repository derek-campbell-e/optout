module.exports = function SpokeoDriver(OptOut, Nightmare){
  let driver = {};

  driver.enabled = false;
  driver.options = {};
  driver.options.captcha = true;
  driver.options.hasGETSearchURL = true;

  driver.urls = {};
  driver.urls.searchPage = "https://www.spokeo.com";
  driver.urls.getSearchURL = function(person){
    return `https://www.spokeo.com/${person.firstName}-${person.lastName}?loaded=1`;
  };

  driver.selectors = {};
  driver.selectors.searchForm = `#homepage_hero_form`;
  driver.selectors.searchFormFirstName = `.homepage_hero_search_box [name='q']`;
  driver.selectors.searchFormLastName = driver.selectors.searchFormFirstName;
  driver.selectors.searchFormButton = `#search`;
  driver.selectors.waitAfterSearch = ".listview_header_section_title";
  driver.selectors.eachProfileOnSearchPage = `.listview_section`;
  driver.selectors.eachProfileSynopsisLocation = '.current_location_row';
  driver.selectors.nextSearchPage = '.pagination .pagination_item:last-child';
  driver.selectors.eachProfileLink = '.listview_section'
  driver.selectors.alternate = {};
  driver.selectors.alternate.eachProfileOnSearchPage = '.listview_section';
  

  return driver;
};