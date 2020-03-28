var today = new Date();
var orgDate = new Date("01/18/2020");
console.log(orgDate);
var difference = Math.ceil((today.getTime() - orgDate.getTime())/(1000 * 3600 * 24));

$("#date-slider").attr("max", difference);
$("#date-slider").on("input", function() {
    checkDate.setTime(orgDate.getTime() + ($(this).val() * 1000 * 3600 * 24));
    
    $("#county-group path").removeClass("level1 level2 level3 level4 level5 level6")
    
    setCountyData();
    
    console.log($(this).val());
});