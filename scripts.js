jQuery(document).ready(function ($) {

    $.get("navbar.html", function (template) {
        $.get("http://localhost/DemoSSL/hs/jqmob/navbar"), function (datajson, template) {
            var data = JSON.parse(datajson);
            var ht = ejs.render(template, { navItemList: data });
            $('#navbar').html(ht);
        }
    });
    
    $.get("divisions.json", function (datajson) {
        console.log(datajson);
        var itemList = datajson;//JSON.parse(datajson);
        
    
        $.get("listform.html", function (data) {
            var ht = ejs.render(data, { itemList: itemList });
            $('#listform').html(ht);
            $('[name="listItem"]').click(function (event) {
                $('#exampleModal').modal('show');
            });
        });
    
    });

    
    

});

