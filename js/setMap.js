var orgDate = Date.UTC(2020, 0, 18, 0, 0, 0);
var checkDate = Date.UTC(2020, 0, 18, 0, 0, 0);
var text = "";

var dateCountyToLevel = {};
var dateToCounty = {};
var allCounties = [];

var breakPoints = [0, 15, 50, 100, 500, 1000];

function setCountyDataDictionary() {
    var lines = text.split("\n");
    
    var firstLine = true;
    
    lines.forEach(function(item, index) {
        if(!firstLine) {
            var splitCommas = item.split(",");

            var date = dateConversion(Date.parse(splitCommas[0]), 'date');
            var county = splitCommas[1].replace(".", "\\.").replace(" ", "_").replace("'", "_");
            var state = splitCommas[2];
            var stateCode = abbrState(state, 'abbr');
            var cases = parseInt(splitCommas[4]);
            var deaths = splitCommas[5];

            if(county == "New York City")
                county = "New_York";
            
            if(!allCounties.includes(county))
                allCounties.push("#" + county + "__" + stateCode);

            if(dateToCounty[date] == undefined) {
                dateToCounty[date] = ["#" + county + "__" + stateCode];
            } else {
                dateToCounty[date].push("#" + county + "__" + stateCode);
            }
                
            var caseLevel = 0;
            if(cases > 0) {
                for(var i = 0; i < breakPoints.length; i += 1) {
                    if(cases > breakPoints[i]) {
                        caseLevel = i + 1;
                    }
                }
            }            

            dateCountyToLevel[date + ":#" + county + "__" + stateCode] = "level" + caseLevel;
            
            //getLastDateForCounty("#" + county + "__" + stateCode, new Date(Date.parse(date) - (1000 * 3600 * 24)));
       } else {
           firstLine = false;
       }
    });
        
    debug = true;
    console.log(today.getTime() <= orgDate);
    today.setHours((new Date(orgDate).getHours()));
    allCounties.forEach(function(item, index) {
       getLastDateForCounty(item, today);
    });
}

var debug = false;

function getLastDateForCounty(county, date) {
    var d = dateConversion(date.getTime(), 'date');
    
    if(dateCountyToLevel[d + ":" + county] == undefined) {
        if(date.getTime() <= orgDate)
            dateCountyToLevel[d + ":" + county] = 0;
        else {
            dateCountyToLevel[d + ":" + county] = getLastDateForCounty(county, new Date(date.getTime() - (1000 * 3600 * 24)));
        }
    }
    
    return dateCountyToLevel[d + ":" + county];
}

function setCountyData() {
    if(Object.keys(dateCountyToLevel).length == 0 && text != "") {
        setCountyDataDictionary();
    }
    
    allCounties.forEach(function(item, index) {
        $(item).removeClass("level1 level2 level3 level4 level5 level6").addClass(dateCountyToLevel[dateConversion(checkDate, 'date') + ":" + item]);
    });
}

function setCountyDataOnFly() {
    if(Object.keys(dateCountyToLevel).length == 0 && text != "") {
        setCountyDataDictionary();
    }
    
    if(dateToCounty[checkDate] != undefined) {
        dateToCounty[checkDate].forEach(function(item, index) {
            $(item).removeClass("level1 level2 level3 level4 level5 level6").addClass(dateCountyToLevel[dateConversion(checkDate, 'date') + ":" + item]);
        });
    } else {
        console.log("NOPE");
    }
}

function getCountyData() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {        
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            text = xmlHttp.responseText;
            setCountyData();
    }
    xmlHttp.open("GET", "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv", true); // true for asynchronous 
    xmlHttp.send(null);
}

getCountyData();

function increaseCheckDate() {    
    checkDate += 1000 * 3600 * 24;
    
    if(checkDate > today.getTime()) {
        return;
    }
    
    setCountyDataOnFly();
    
    setTimeout(increaseCheckDate, 100);
}