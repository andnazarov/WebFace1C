/*jQuery(document).ready(function ($) {
    
    $.get("divisions.json", function (datajson) {
        var itemList = datajson;//JSON.parse(datajson);
        
        var divsList = $("#divsList");
        
        itemList.forEach(function(item, i, itemList) {
           
           var element = '<li id="div' + item.id + '"><a href="#">' + item.id + '. ' + item.caption + '<span class="ui-li-count">12</span></a></li>';
           divsList.append(element);
            
        });
    
    });
    
});*/

$( "*" ).on( "pagecreate", function( event ) {

    $.get("divisions.json", function (datajson) {
        var itemList = datajson;//JSON.parse(datajson);
        
        var divsList = $("#divsList");
        
        itemList.forEach(function(item, i, itemList) {
           
           var element = '<li id="div' + item.id + '"><a href="#">' + item.id + '. ' + item.caption + '<span class="ui-li-count">' + item.questios_count + '</span></a></li>';
           divsList.append(element);
            
        });
        
        divsList.listview("refresh");
    
    });

});