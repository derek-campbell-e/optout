module.exports = function SpokeoDriver(OptOut, Nightmare){
  let driver = {};

  driver.enabled = false;
  driver.options = {};
  driver.options.captcha = true;
  driver.options.hasGETSearchURL = true;

  driver.urls = {};
  driver.urls.searchPage = "https://www.nuwber.com";
  driver.urls.getSearchURL = function(person){
    return `https://nuwber.com/search?SearchForm%5Bname%5D=${person.firstName}+${person.lastName}&SearchForm%5Bcity%5D=&SearchForm%5Bstate%5D=`;
  };

  driver.selectors = {};
  driver.selectors.searchForm = `#w0`;
  driver.selectors.searchFormFirstName = `#searchform-name`;
  driver.selectors.searchFormLastName = driver.selectors.searchFormFirstName;
  driver.selectors.searchFormButton = `#w0 [type='submit']`;
  driver.selectors.waitAfterSearch = ".search-results";
  driver.selectors.eachProfileOnSearchPage = `.search-item`;
  driver.selectors.eachProfileSynopsisLocation = '.addr';
  driver.selectors.nextSearchPage = '.pagination .next';
  driver.selectors.eachProfileLink = 'h2 a'
  driver.selectors.alternate = {};
  driver.selectors.alternate.eachProfileOnSearchPage = '.listview_section';
  

  return driver;
};