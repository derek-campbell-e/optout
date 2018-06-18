module.exports = function ThatsThemDriver(OptOut, Nightmare){
  let driver = {};

  driver.enabled = true;
  driver.options = {};
  driver.options.captcha = true;
  driver.options.hasGETSearchURL = true;
  driver.options.fakeSearchPage = true;

  driver.urls = {};
  driver.urls.searchPage = "www.checkthem.com/";
  driver.urls.getSearchURL = function(person){
    return `https://thatsthem.com/name/${person.firstName}-${person.lastName}`;
  };

  driver.selectors = {};
  driver.selectors.searchForm = `#homepage_hero_form`;
  driver.selectors.searchFormFirstName = `.homepage_hero_search_box [name='q']`;
  driver.selectors.searchFormLastName = driver.selectors.searchFormFirstName;
  driver.selectors.searchFormButton = `#search`;
  driver.selectors.waitAfterSearch = ".ThatsThem-records";
  driver.selectors.eachProfileOnSearchPage = `.ThatsThem-record`;
  driver.selectors.eachProfileSynopsisLocation = '.ThatsThem-record-address';
  driver.selectors.eachProfileSynopsisAge = '.ThatsThem-record-age .active';
  

  driver.funcs = {};

  
  OptOut.functionCreator(driver.funcs, 'eachProfileLocation', ['profileDom'], 'location',`
    let loc = [];
    let addrDom = profileDom.find('.ThatsThem-record-address');
    loc.push(addrDom.find("[itemprop='addressLocality']").text() + "," + addrDom.find("[itemprop='addressRegion']").text());
    return loc;
  `);
  
  /*
  OptOut.functionCreator(driver.funcs, 'eachProfileID', ['profileDom'], 'id', `
    let link = profileDom.find("a").attr('onclick');
    let index = link.replace(/\\D/g, "");
    let result = $scope.results[index];
    console.log(link, index, result);
    return result.token;
  `);

  OptOut.functionCreator(driver.funcs, 'api', ['profileDom'], null, `
    let link = profileDom.find("a").attr('onclick');
    let index = link.replace(/\\D/g, "");
    let result = $scope.results[index];
    return result
  `);
  */


  
  return driver;
};