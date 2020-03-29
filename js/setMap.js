var orgDate = Date.UTC(2020, 0, 18, 0, 0, 0);
var checkDate = Date.UTC(2020, 0, 18, 0, 0, 0);
var text = "";

var dateCountyToLevel = {};
var dateToCounty = {};
var allCounties = [];
var countyToName = {};


var countyToCases = {};
var countyToDeaths = {};
var datesToTotalCases = {};
var datesToTotalDeaths = {};

var breakPoints = [0, 15, 50, 100, 500, 1000];

function setCountyDataDictionary() {
    var lines = text.split("\n");
    
    var firstLine = true;
    
    lines.forEach(function(item, index) {
        if(!firstLine) {
            var splitCommas = item.split(",");

            var date = Date.parse(splitCommas[0]);
            date = new Date(date).setHours(0, 0, 0, 0);
            
            if(date > latestDate)
                latestDate = date;
            
            var county = splitCommas[1].replace(".", "\\.").replace(" ", "_").replace("'", "_");
            var state = splitCommas[2];
            var stateCode = abbrState(state, 'abbr');
            var cases = parseInt(splitCommas[4]);
            var deaths = parseInt(splitCommas[5]);

            if(county == "New York City")
                county = "New_York";
            
            if(!allCounties.includes("#" + county + "__" + stateCode))
                allCounties.push("#" + county + "__" + stateCode);
            
            if(countyToName["#" + county + "__" + stateCode] == undefined)
                countyToName["#" + county + "__" + stateCode] = splitCommas[1] + ", " + stateCode;

            if(dateToCounty[date] == undefined) {
                dateToCounty[date] = ["#" + county + "__" + stateCode];
            } else {
                dateToCounty[date].push("#" + county + "__" + stateCode);
            }
            
            
            
            if(datesToTotalCases[date] == undefined) {
                datesToTotalCases[date] = cases;
                datesToTotalDeaths[date] = deaths;
            } else {
                datesToTotalCases[date] += cases;
                datesToTotalDeaths[date] += deaths;
            }                
            
            countyToCases["#" + county + "__" + stateCode] = cases;
            countyToDeaths["#" + county + "__" + stateCode] = deaths;
            
            
            
                
            var caseLevel = 0;
            if(cases > 0) {
                for(var i = 0; i < breakPoints.length; i += 1) {
                    if(cases > breakPoints[i]) {
                        caseLevel = i + 1;
                    }
                }
            }            

            dateCountyToLevel[date + ":#" + county + "__" + stateCode] = "level" + caseLevel;
            
            getLastDateForCounty("#" + county + "__" + stateCode, new Date(date - (1000 * 3600 * 24)));
       } else {
           firstLine = false;
       }
    });
        
    today.setHours(0, 0, 0, 0);
    allCounties.forEach(function(item, index) {
       getLastDateForCounty(item, today);
    });
    
    allCounties.sort();    
    addStatistics();
    
    checkDate = latestDate;
    
    $("#warning p").text("There's not enough data for this date. (Latest date: " + dateConversion(latestDate - 1000 * 3600 * 24, 'date') + ")")
}

function getLastDateForCounty(county, date) {  
    date = new Date(date.setHours(0, 0, 0, 0));
    
    if(dateCountyToLevel[date.getTime() + ":" + county] == undefined) {        
        if(date.getTime() <= orgDate)
            dateCountyToLevel[date.getTime() + ":" + county] = 0;
        else {
            dateCountyToLevel[date.getTime() + ":" + county] = getLastDateForCounty(county, new Date(date.getTime() - (1000 * 3600 * 24)));
        }
    }
    
    return dateCountyToLevel[date.getTime() + ":" + county];
}

function setCountyData() {
    if(Object.keys(dateCountyToLevel).length == 0 && text != "") {
        setCountyDataDictionary();
    }
    
    allCounties.forEach(function(item, index) {
        $(item).removeClass("level1 level2 level3 level4 level5 level6").addClass(dateCountyToLevel[checkDate + ":" + item]);
    });
}

function setCountyDataOnFly() {
    if(Object.keys(dateCountyToLevel).length == 0 && text != "") {
        setCountyDataDictionary();
    }
    
    if(dateToCounty[checkDate] != undefined) {
        dateToCounty[checkDate].forEach(function(item, index) {
            $(item).removeClass("level1 level2 level3 level4 level5 level6").addClass(dateCountyToLevel[checkDate + ":" + item]);
        });
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

var cancelIncrease = false;
function increaseCheckDate() {    
    checkDate += 1000 * 3600 * 24;
    checkDate = new Date(checkDate).setHours(0, 0, 0, 0);
    
    if(checkDate > today.getTime() || cancelIncrease == true) {
        $("#play-pause").removeClass("playing");
        
        cancelIncrease = false;
        return;
    }
    
    if(checkDate > latestDate) {
        enableWarning();
    }
    
    setCountyDataOnFly();
    
    $("#date-slider").prop("value", parseInt($("#date-slider").prop("value")) + 1);
    
    updateLabelText();
    
    setTimeout(increaseCheckDate, 100);
}