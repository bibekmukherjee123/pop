var base_url = "";
//var base_url = "http://localhost:1234"
//var base_url = "";
var propertyTypeIds = [];
var properties = [];
var property_tags_distinct = [];
$(document).ready(function() {

    $('.keyword').select2({
        placeholder: "Type Location",
        minimumInputLength: 3,
        allowClear: true,
        closeOnSelect: true,
        minimumResultsForSearch: -1
    });

    // $('.prop-type').select2({
    //     placeholder: "Property Type",
    //     minimumResultsForSearch: Infinity,
    //     allowClear: true,
    //     closeOnSelect: true,
    // });

    // $('.budget').select2({
    //     placeholder: "Budget",
    //     minimumResultsForSearch: Infinity,
    //     allowClear: true,
    //     closeOnSelect: true,
    // });


    $("#min").click(function() {
        $("#min_show").show();
        $("#max_show").hide();
    });

    $("#max").click(function() {
        $("#max_show").show();
        $("#min_show").hide();
    });

    $.ajax({
        url: base_url + "/propertytypes/list/",
        type: "get",
        success: function(result) {
            //console.log('fetched property types data');
            var residential = document.getElementById('property_checkbox');
            for (var i = 0; i < result.length; i++) {
                var labeltag = document.createElement('label');
                labeltag.setAttribute("for", "checkbox" + i);
                labeltag.innerHTML = result[i].name;
                var inputtag = document.createElement('input');
                inputtag.type = 'checkbox';
                inputtag.value = result[i]._id;
                inputtag.id = "checkbox" + i;
                inputtag.name = "prop-type-residential"
                residential.appendChild(inputtag);
                residential.appendChild(labeltag);
                //labeltag.innerHTML = result[i].name;
                residential.appendChild(labeltag);
                // $('<option>').val(result[i]._id).text(result[i].name).appendTo('#prop-type');
                propertyTypeIds.push(result[i]._id);
            }
        },
        error: function(err) {
            console.log('there was issue fetching the property types');
        }
    });

    $.ajax({
        url: base_url + "/searchtags/list",
        type: "get",
        success: function(result) {
            //console.log('fecthed tags');
            property_tags_distinct = [...new Set(result.map(x => { return { name: x.name, id: x._id }; }))];
            var pageno = 1;
            var paginate = true;
            getPropertyValues(pageno, paginate);
            propertyDropdown();
        },
        error: function(err) {
            console.log('there was issue fetching the Tags');
        }
    });

});

function getPropertyValues(pageno, paginate) {
    $.ajax({
        url: base_url + "/propertylist/all?pagenumber=" + pageno,
        type: "get",
        success: function(result) {
            // console.log('fetched property list data');
            var propertylist = result.list;
            var totalPages = result.totalpages;
            displayPropertyCards(propertylist);
            //createPropertyDropdown(propertylist);
            // console.log(totalPages);
            if (paginate == true) { createPagination(totalPages); }
            properties = propertylist;

        },
        error: function(err) {
            console.log('there was issue fetching the property list');
        }
    });
}

function propertyDropdown() {
    $.ajax({
        url: base_url + "/propertylist/userList",
        type: "get",
        success: function(result) {
            // console.log('fetched property list data');
            var propertylist = result.list;
            createPropertyDropdown(propertylist);
        },
        error: function(err) {
            console.log('there was issue fetching the property list');
        }
    });
}

var current = null;

function showresponddiv(messagedivid) {
    var id = messagedivid.replace("message-", "respond-"),
        div = document.getElementById(id);

    // hide previous one
    if (current && current != div) {
        current.style.display = 'none';
    }

    if (div.style.display == "none") {
        div.style.display = "inline";
        current = div;
    } else {
        div.style.display = "none";
    }
}

function createPropertyDropdown(result) {
    // console.log("creating dropdown")
    // var property_title_distinct = [...new Set(result.map(x => x.title))];
    // var property_location_distinct = [...new Set(result.map(x => x.location))];
    // for (var i = 0; i < property_title_distinct.length; i++) {
    //     $('<option>').val(property_title_distinct[i]).text(property_title_distinct[i]).appendTo('#property_names');
    // }
    // for (var i = 0; i < property_location_distinct.length; i++) {
    //     $('<option>').val(property_location_distinct[i]).text(property_location_distinct[i]).appendTo('#locations');
    // }
    for (var i = 0; i < property_tags_distinct.length; i++) {
        $('<option>').val(property_tags_distinct[i].name).text(property_tags_distinct[i].name).appendTo('#property_tags');
    }
}

function searchProperty() {
    // console.log('searching property');
    var location = [],
        tags = [],
        title = [];
    $('#keyword').find("option:selected").each(function() {

        var label = $(this).parent().attr("label");
        // if (label == "Property Names") {
        //     title.push($(this).val());
        // } else if (label == "Locations") {
        //     location.push($(this).val());
        // } else
        if (label == "Location Tags") {
            tags.push($(this).val());
        } else { console.log('Nothing Selected') }
    });
    var propertyType = [];
    $.each($("input[name=prop-type-residential]:checked"), function() {
        propertyType.push($(this).val());
    });
    var upper = $("#budget_max").val();
    var lower = $("#budget_min").val();
    var datatosent = {
            "propertyType": propertyType,
            "upper": upper,
            "lower": lower,
            // "location": location,
            "tags": tags,
            // "title": title
        }
        //console.log(datatosent);
        //if (location != "" || title != "" || tags != "") {
        //console.log('fetching property');
    $.ajax({
        url: base_url + "/propertylist/search",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(datatosent),
        success: function(result) {

            //console.log('fetched t property  data');
            //console.log(result);
            if (result.list.length > 0) {
                $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>We could get ' + result.list.length + ' matching properties</div>');
                var propertylist = result.list;
                displayPropertyCards(propertylist);
            } else {
                $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>No Property matched your criteria!</div>');
            }
        },
        error: function(err) {
            console.log('there was issue fetching the properties');
        }
    });
    // }
}

function displayPropertyCards(result) {
    //console.log(result.length);
    //console.log('creating cards');

    var mainDiv = document.getElementById('cardDiv');
    $('#cardDiv').empty();
    for (var i = 0; i < result.length; i++) {
        var parentDiv = document.createElement('div');
        parentDiv.classList.add('col-lg-4', 'col-md-6');
        var cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.style.minHeight = "475px";
        //cardDiv.style.maxHeight = "475px";

        var imageDiv = document.createElement('img');
        imageDiv.style.maxHeight = "200px";
        imageDiv.classList.add('card-img-top', 'img-fluid');
        imageDiv.src = base_url + '/' + result[i].logo;
        imageDiv.alt = "Property Logo";

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.style.minHeight = '208px';
        var titleDiv = document.createElement('h5');
        titleDiv.classList.add('card-title', 'pull-left');
        titleDiv.innerHTML = result[i].title;
        var mapmarker = document.createElement('i');
        mapmarker.classList.add('la', 'la-map-marker');
        titleDiv.appendChild(mapmarker);

        var bedroom = document.createElement('p');
        bedroom.classList.add('pull-right');
        bedroom.innerHTML = '<span>' + result[i].bedrooms + '</span>';

        var clearfix = document.createElement('div');
        clearfix.classList.add('clearfix');

        var infoDiv = document.createElement('div');
        infoDiv.classList.add('body_inner');
        var saleablePara = document.createElement('p');
        saleablePara.innerHTML = '<span>Saleable Area:</span>' + result[i].saleableArea + ' sqft.'
        var addressPara = document.createElement('p');
        addressPara.innerHTML = '<span>Location:</span>' + result[i].location;
        var furnishedPara = document.createElement('p');
        if (result[i].furnished) {
            furnishedPara.innerHTML = '<span>Furnishing:</span>' + result[i].furnished;
        } else { furnishedPara.innerHTML = '<span>Furnishing:</span>' + 'NA'; }
        infoDiv.appendChild(saleablePara);
        infoDiv.appendChild(addressPara);
        infoDiv.appendChild(furnishedPara);

        cardBody.appendChild(titleDiv);
        cardBody.appendChild(bedroom);
        cardBody.appendChild(clearfix);
        cardBody.appendChild(infoDiv);

        var footerDiv = document.createElement('div');
        footerDiv.classList.add('card-footer');
        footerDiv.style.minHeight = '60px';

        var priceInfo = document.createElement('div');
        priceInfo.classList.add('pull-left');
        var basePricePara = document.createElement('p');
        var priceString = (result[i].price).toString();
        var priceLength = priceString.length;
        if (priceLength == 4 || priceLength == 5) {
            var finalPrice = (result[i].price / 1000);
            basePricePara.innerHTML = '<span>Base Price:</span> ₹' + finalPrice + ' K';
        } else if (priceLength == 6 || priceLength == 7) {
            var finalPrice = (result[i].price / 100000);
            basePricePara.innerHTML = '<span>Base Price:</span> ₹' + finalPrice + ' Lacs';
        } else if (priceLength == 8 || priceLength == 9) {
            var finalPrice = (result[i].price / 10000000);
            basePricePara.innerHTML = '<span>Base Price:</span> ₹' + finalPrice + ' Cr';
        }
        // if(finalPrice.length < 3)

        priceInfo.appendChild(basePricePara);

        var enquiryDiv = document.createElement('div');
        enquiryDiv.classList.add('pull-right');
        var anchorDiv = document.createElement('a');
        anchorDiv.classList.add('btn', 'btn-primary');
        anchorDiv.href = '/tour/360/property.html?id=' + result[i]._id;
        anchorDiv.target = '_blank';
        anchorDiv.innerHTML = 'View In 360';
        enquiryDiv.appendChild(anchorDiv);


        footerDiv.appendChild(priceInfo);
        footerDiv.appendChild(enquiryDiv);

        cardDiv.appendChild(imageDiv);
        cardDiv.appendChild(cardBody);
        cardDiv.appendChild(footerDiv);

        parentDiv.appendChild(cardDiv);
        mainDiv.appendChild(parentDiv);
    }
}

function createPagination(totalPages) {
    // totalPages = 4;
    document.getElementById("prevpage").addEventListener("click", function(e) {
        //console.log('previouspage');
        var currentpageno = $('#paginatebutton').find('.active').val();
        $('#paginatebutton div.active').prev().addClass('active').siblings().removeClass('active');
        var pageno = $('#paginatebutton').find('.active').val();
        var paginate = false;
        if (currentpageno != pageno) { getPropertyValues(pageno, paginate); }
    });
    document.getElementById("nextpage").addEventListener("click", function(e) {
        //console.log('nextpage');
        var currentpageno = $('#paginatebutton').find('.active').val();
        $('#paginatebutton div.active').next().addClass('active').siblings().removeClass('active');
        var pageno = $('#paginatebutton').find('.active').val();
        var paginate = false;
        if (currentpageno != pageno) { getPropertyValues(pageno, paginate); }
    });
    var paginate = document.getElementById('paginatebutton');
    var pagebutton = document.createElement('div');
    pagebutton.classList.add('page-item', 'active');
    pagebutton.value = 1;
    var anchorPage = document.createElement('a');
    anchorPage.classList.add('page-link');
    anchorPage.innerHTML = 1;
    anchorPage.href = '#';
    var pageno = 1;
    pagebutton.onclick = (function(pageno) {
        return function() {
            $(this).addClass('active').siblings().removeClass('active');
            var paginate = false;
            getPropertyValues(pageno, paginate);
        }
    })(pageno);
    pagebutton.appendChild(anchorPage);
    paginate.appendChild(pagebutton);
    for (var i = 1; i < totalPages; i++) {
        var pagebutton = document.createElement('div');
        pagebutton.classList.add('page-item');
        pagebutton.value = i + 1;
        var anchorPage = document.createElement('a');
        anchorPage.classList.add('page-link');
        anchorPage.innerHTML = i + 1;
        anchorPage.href = '#';
        var pageno = i + 1;
        pagebutton.onclick = (function(pageno) {
            return function() {
                $(this).addClass('active').siblings().removeClass('active');
                var paginate = false;
                getPropertyValues(pageno, paginate);
            }
        })(pageno);
        pagebutton.appendChild(anchorPage);
        paginate.appendChild(pagebutton);
    }
}

$('.block-container').mouseover(function() {
    $('.select2-selection__rendered').css('overflow-y', 'hidden');
    $('.select2-selection__rendered').css('height', 'auto');

});

$('.block-container').mouseout(function() {
    $('.select2-selection__rendered').css('overflow-y', 'scroll');
    $('.select2-selection__rendered').css('height', '37px');

});