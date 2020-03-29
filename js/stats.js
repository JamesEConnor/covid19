function addStatistics() {
    allCounties.forEach(function(item, index) {
        countyAdd = "<tr><td>" + countyToName[item] + "</td><td>" + countyToCases[item] + "</td><td>" + countyToDeaths[item] + "</td></tr>";

        $("#stats table:not(#stickyHeader) tbody").append(countyAdd);
    });
    
    $("#table-container table").floatThead({
        scrollContainer: function(table) {
            return table.closest("#table-container");
        }
    });
    
    $(window).resize(function() {
        $("#table-container table").floatThead("reflow");
    })
}