function getSliderLabelPosition(value, min, max) {
    var percentage = (value - min)/(max - min);
    var w_label = $("#date-slider-label").width();
    var w_bar = $("#date-slider").width();
    var l_bar = $("#date-slider").position().left;
    
    return ((w_bar - w_label) * percentage) + l_bar;
}

$(document).ready(function() {    
    $("#date-slider-label").css("left", getSliderLabelPosition($("#date-slider").val(), $("#date-slider").attr("min"), $("#date-slider").attr("max")) + "px");
    
    $("#date-slider").on("input", function() {
        $("#date-slider-label").css("left", getSliderLabelPosition($(this).val(), $(this).attr("min"), $(this).attr("max")) + "px");
        
        var newDisplayDate = new Date(orgDate + ($(this).val() * 1000 * 3600 * 24));
        
        console.log(newDisplayDate);
        
        $("date-slider-label p").text(newDisplayDate.getMonth() + "/" + newDisplayDate.getDate() + "/" + newDisplayDate.getYear());
    });
});