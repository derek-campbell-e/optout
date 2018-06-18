module.exports = function FastPeopleSearchDriver(OptOut, Nightmare){
  let driver = {};

  driver.enabled = true;
  driver.options = {};
  driver.options.captcha = true;
  driver.options.hasGETSearchURL = true;

  driver.urls = {};
  driver.urls.searchPage = "www.fastpeoplesearch.com/";
  driver.urls.getSearchURL = function(person){
    return `https://www.fastpeoplesearch.com/name/${person.firstName}-${person.lastName}`;
  };

  driver.selectors = {};
  driver.selectors.searchForm = `#homepage_hero_form`;
  driver.selectors.searchFormFirstName = `.homepage_hero_search_box [name='q']`;
  driver.selectors.searchFormLastName = driver.selectors.searchFormFirstName;
  driver.selectors.searchFormButton = `#search`;
  driver.selectors.waitAfterSearch = ".people-list";
  driver.selectors.eachProfileOnSearchPage = `.card`;
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