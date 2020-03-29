var w_label = $("#date-slider-label").width();

function getSliderLabelPosition(value, min, max) {
    var percentage = (value - min)/(max - min);
    var w_bar = $("#date-slider").width();
    var l_bar = $("#date-slider").position().left;
    
    return ((w_bar - w_label) * percentage) + l_bar;
}

$(document).ready(function() {    
    $("#date-slider-label").css("left", getSliderLabelPosition($("#date-slider").val(), $("#date-slider").attr("min"), $("#date-slider").attr("max")) + "px");
    
    $("#date-slider").on("input", function() {
        $("#date-slider-label:not(.hover)").css("left", getSliderLabelPosition($(this).val(), $(this).attr("min"), $(this).attr("max")) + "px");
        
        var newDisplayDate = dateConversion(orgDate + ($(this).val() * 1000 * 3600 * 24), 'date');
                
        $("#date-slider-label p").text(newDisplayDate);
        
        if(checkDate < latestDate) {
            $("#cases-label p").text((datesToTotalCases[checkDate] == undefined ? "0" : datesToTotalCases[checkDate]) + " Cases");
            $("#deaths-label p").text((datesToTotalDeaths[checkDate] == undefined ? "0" : datesToTotalDeaths[checkDate]) + " Deaths");
            
            $("#warning").removeClass("show");
            $("#cases-label, #deaths-label").addClass("show");
        } else {
            $("#warning").addClass("show");
            $("#cases-label, #deaths-label").removeClass("show");
            
            $("#warning p").text("There's not enough data for this date. (Latest date: " + dateConversion(latestDate, 'date') + ")")
        }
    }).change(function() {
        if(!$("#date-slider-label").hasClass("hover"))
            $("#date-slider-label p").text("Show Information");
    });
    
    $("#date-slider-label").click(function() {
        $(this).toggleClass("hover");
        $("#cases-label, #deaths-label").toggleClass("hover");
        $("#warning").toggleClass("hover");
        
        $("#date-slider-label:not(.hover)").css("left", getSliderLabelPosition($("#date-slider").val(), $("#date-slider").attr("min"), $("#date-slider").attr("max")) + "px");
        
        $("#date-slider-label.hover").css("left", "30px");
        
        if($(this).hasClass("hover")) {
            var newDisplayDate = dateConversion(orgDate + ($("#date-slider").val() * 1000 * 3600 * 24), 'date');
            
            $("#date-slider-label p").text(newDisplayDate);
        } else {
            $("#date-slider-label p").text("Show Information");
        }
    });
});