var checkDate = new Date("01/20/2020");
var text = "";

var breakPoints = [0, 15, 50, 100, 500, 1000];

function setCountyData() {
    if(text == "")
        return;
    
    var lines = text.split("\n");
    
    if(breakPoints.length == 0) {
        breakPoints = getBreakPoints(lines);
    }
    
    var firstLine = true;    
    lines.forEach(function(item, index) {
        if(!firstLine) {
            var splitCommas = item.split(",");
            
            var date = Date.parse(splitCommas[0]);
            var county = splitCommas[1].replace(".", "\\.").replace(" ", "_").replace("'", "_");
            var state = splitCommas[2];
            var cases = parseInt(splitCommas[4]);
            var deaths = splitCommas[5];
            
            if(county == "New York City")
                county = "New_York";
            
            if(date <= checkDate) {
                var stateCode = abbrState(state, 'abbr');
                
                var caseLevel = 0;
                
                if(cases > 0) {
                    for(var i = 0; i < breakPoints.length; i += 1) {
                        if(cases > breakPoints[i]) {
                            caseLevel = i + 1;
                        }
                    }
                }
                
                $("#" + county + "__" + stateCode).removeClass("level1 level2 level3 level4 level5 level6").addClass("level" + caseLevel);
            } else {
                return;
            }
        } else {
            firstLine = false;
        }
    });
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


function increaseDate() {
    checkDate.setTime(checkDate.getTime() + 1);
    setCountyData();
}