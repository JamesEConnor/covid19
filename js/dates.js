var latestDate = Date.UTC(2020, 0, 18, 0, 0, 0);

var today = new Date();
today.setHours(0, 0, 0, 0);

var orgDate = Date.UTC(2020, 0, 18, 0, 0, 0);
var difference = Math.floor((today.getTime() - orgDate)/(1000 * 3600 * 24));

while(orgDate + ((difference - 1) * 1000 * 3600 * 24) > today.getTime())
    difference -= 1;

$("#date-slider").attr("max", difference);
$("#date-slider").attr("value", difference);
$("#date-slider").on("input", function() {
    checkDate = new Date(orgDate + ($(this).val() * 1000 * 3600 * 24)).setHours(0, 0, 0, 0);
    
    if(latestDate == undefined || checkDate <= latestDate)
        $("#county-group path").removeClass("level1 level2 level3 level4 level5 level6")
    
    setCountyDataOnFly();
}).on("change", function() {
    checkDate = new Date(orgDate + ($(this).val() * 1000 * 3600 * 24)).setHours(0, 0, 0, 0);
    
    $("#county-group path").removeClass("level1 level2 level3 level4 level5 level6")
    
    setCountyData();
})