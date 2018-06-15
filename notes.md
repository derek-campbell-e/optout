## backgroundalert.com
- paginated: false
- private results: true
- requires ID validation: true
- optout search: true

## archives.com
- paginated: ?
- private results: true
- optout search: false
- requires ID validation: ?

## FastPeopleSearch.com
- paginated: true
- private results: false
- optout search: true
- auto-removal: true
- removal link: "[title='Remove this record']"
- max removals: 3
- get search url: https://www.fastpeoplesearch.com/name/[first]-[last]/page/4

## golookup
- fake search loading: true
- has state filter: true
- optout requires personal information: true

## radaris 
- has state filter: true
- get search url: https://radaris.com/ng/search?ff=[FIRST]&fl=[LAST]&fs=[STATE]

## spytox
- has state filter: true
- get search url: https://www.spytox.com/[First]-[Last]
- auto-removal: true
- removal captcha: true 

## thatsthem
- has state filter: true
- get search url: https://thatsthem.com/name/[first]-[last]/CA
- optout requires personal information: true
- removal captcha: true 

## beenverifed
- has state filter: true
- optout search: true
- optout requires email confirmation: true
- removal captcha: true 

## truthfinder
- has state filter: true
- optout search: true
- get search url: https://www.truthfinder.com/opt-out/results/?firstName=[first]&lastName=[last]&city=&state=CA
- optout requires email confirmation: true
- removal captcha: true 

## usa-people-search
- has state filter: true
- optout search: true
- removal captcha: true

## verifythem
- has state filter: true
- optout search: true
- removal captcha: true
- get search url: https://www.verifythem.com/search/[first]-[last]/CA?optout=true
- optout requires email confirmation: true
- optout requires reason: true

## whitepages
- has state filter: true
- optout requires profile url: true
- optout requires reason: true
- optout requires phone verification: true
- optout process: verify profile, reason, phone verification


## truepeoplesearch
- has state filter: true
- optout search: true
- removal captcha: true
- get search url: https://www.truepeoplesearch.com/results?name=[first]%20[last]&citystatezip=California&agerange=53-120
- has pagination: true

## peoplesmart
- has state, city filter: true
- optout search: true
- get search url: https://www.peoplesmart.com/optout-results?Find=[first]%20[last]&FirstName=[first]&LastName=[last]
- removal captcha: true
- optout requires email confirmation: true

## peoplesearchnow
- has state filter: true
- optout search: true
- has pagination: true
- removal captcha: true
- get search url: www.peoplesearchnow.com/opt-out/person/[first]-[last]/page3

## peoplelooker
- has state filter: true
- optout search: true
- get search url: https://www.peoplelooker.com/f/search/person?fn=[first]&ln=[last]&optout=true&state=CA
- removal captcha: true
- optout requires email confirmation: true
- no plus+ filtering: true
- datasource: beenverified.com

## peoplefinders
- has state filter: true
- optout search: true
- get search url: https://www.peoplefinders.com/manage/searchresults?search=People&fn=[first]&ln=[last]&city=&state=CA&opt=1
- removal captcha: true
- optout limits: [3 poeple total / 1 in 7 days]

## peoplefinder
- has state filter: true
- optout link in profile: true
- SSL ISSUE

## peekyou
- optout requires id: true
- removal captcha: true
- optout requires personal information: true
- get search url: www.peekyou.com/usa/california/[first]_[last]/
- has pagination: true
- optout link in profile: true
- multiple profiles

## intellius
- has state filter: true
- optout search: true
- removal captcha: true
- optout requires email confirmation: true

## instantpeoplefinder
- optout requires personal information: true
- optout requires addess from site: true
- optout requires profile url: true
- has state filter: true
- results go to publicrecords360.com

## publicrecords360
- optout requires personal information: true
- optout requires addess from site: true
- optout requires profile url: true
- has state filter: true

## instantcheckmate
- has state filter: true
- optout search: true
- optout requires email confirmation: true
- removal captcha: true

## idtrue
- has state filter: true
- optout search: true
- optout requires email confirmation: true
- get search url: https://www.idtrue.com/optout/results.php?first=[first]&last=[last]&state=[State]&check=
- possible auto-optout with url: https://www.idtrue.com/optout/confirm.php?id=[profileid]

## infotracer
- fake search loading: true
- MANUAL OPT-OUT: true
- optout requires personal information: true
- optout requires state id/license: true

## peoplelookup
- MANUAL OPT-OUT: true
- optout requires personal information: true
- optout requires state id/license: true