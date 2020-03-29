var today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);

var orgDate = Date.UTC(2020, 0, 18, 0, 0, 0);
console.log(orgDate);
var difference = Math.floor((today.getTime() - orgDate)/(1000 * 3600 * 24));

while(orgDate + ((difference + 1) * 1000 * 3600 * 24) > today.getTime())
    difference -= 1;

$("#date-slider").attr("max", difference);
$("#date-slider").on("input", function() {
    checkDate = orgDate + ($(this).val() * 1000 * 3600 * 24);
    
    $("#county-group path").removeClass("level1 level2 level3 level4 level5 level6")
    
    setCountyDataOnFly();
}).on("change", function() {
    checkDate = orgDate + ($(this).val() * 1000 * 3600 * 24);
    
    $("#county-group path").removeClass("level1 level2 level3 level4 level5 level6")
    
    setCountyData();
})