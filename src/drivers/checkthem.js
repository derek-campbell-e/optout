module.exports = function SpokeoDriver(OptOut, Nightmare){
  let driver = {};

  driver.enabled = true;
  driver.options = {};
  driver.options.captcha = true;
  driver.options.hasGETSearchURL = true;
  driver.options.fakeSearchPage = true;

  driver.urls = {};
  driver.urls.searchPage = "www.checkthem.com/";
  driver.urls.getSearchURL = function(person){
    return `https://www.checkthem.com/app/search-results-v3?firstname=${person.firstName}&lastname=${person.lastName}&state=00`;
  };

  driver.selectors = {};
  driver.selectors.searchForm = `#homepage_hero_form`;
  driver.selectors.searchFormFirstName = `.homepage_hero_search_box [name='q']`;
  driver.selectors.searchFormLastName = driver.selectors.searchFormFirstName;
  driver.selectors.searchFormButton = `#search`;
  driver.selectors.waitAfterSearch = ".results-table";
  driver.selectors.eachProfileOnSearchPage = `#resultRows .mobile-results-rows`;
  driver.selectors.eachProfileSynopsisLocation = 'td:nth-child(3)';
  //driver.selectors.nextSearchPage = '.pagination .pagination_item:last-child';
  //driver.selectors.eachProfileLink = '.listview_section'
  driver.selectors.alternate = {};
  driver.selectors.alternate.eachProfileOnSearchPage = '.listview_section';

  driver.funcs = {};
  driver.funcs.eachProfileSynopsisLocation = {};
  driver.funcs.eachProfileSynopsisLocation.args = ['profileDom'];
  driver.funcs.eachProfileSynopsisLocation.func = `
    var locs = [];
    profileDom.find(".different-line").each(function(i,e){
      locs.push($(e).text());
    });
    return locs;
  `;
  

  return driver;
};