var today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);

var orgDate = new Date(1579305600000);
console.log(orgDate);
var difference = Math.floor((today.getTime() - orgDate.getTime())/(1000 * 3600 * 24));

while(new Date(orgDate.getTime() + (difference * 1000 * 3600 * 24)) > today - 1)
    difference -= 1;

$("#date-slider").attr("max", difference);
$("#date-slider").on("input", function() {
    checkDate.setTime(orgDate.getTime() + ($(this).val() * 1000 * 3600 * 24));
    
    $("#county-group path").removeClass("level1 level2 level3 level4 level5 level6")
    
    setCountyDataOnFly();
}).on("change", function() {
    checkDate.setTime(orgDate.getTime() + ($(this).val() * 1000 * 3600 * 24));
    
    $("#county-group path").removeClass("level1 level2 level3 level4 level5 level6")
    
    setCountyData();
})