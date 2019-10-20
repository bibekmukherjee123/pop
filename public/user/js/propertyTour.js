var base_url = "";

var propertyTitle = "";
var propertyTypeIds = [];
//var properties = [];
var filepath;
var panorama_hero;
var property_tags_distinct;
mapboxgl.accessToken = "pk.eyJ1IjoiYWJoaXNoZWswNSIsImEiOiJjanpkdHJoY2YwMmZuM21xbTVweXZndHczIn0.yHFLb4I5gBe5pRwCishEvA";

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


    $(function() {
        $('.footer_blog h5').click(function() {
            $(this).parent().toggleClass('active');
        });
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
            //console.log(property_tags_distinct);
            userPropertyDropdown();
        },
        error: function(err) {
            console.log('there was issue fetching the Tags');
        }
    });





    //console.log("here");

    var url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {},
        tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        var propertyid = tmp[1];
    }

    $.ajax({
        url: base_url + "/propertylist/read/" + propertyid,
        type: "get",
        success: function(result) {
            //console.log('got property list');
            //console.log(result);
            propertyTitle = result.title;
            document.title = result.title;
            document.querySelector('meta[name="description"]').setAttribute("content", result.overview);

            //console.log(propertyTitle);
            loadPanoroma(result);
            displayOverlayDetails(result);
        },
        error: function(err) {
            console.log('there was issue fetching the property list');
        }
    });

});

function userPropertyDropdown() {
    $.ajax({
        url: base_url + "/propertylist/userList",
        type: "get",
        success: function(result) {
            //console.log('fetched property list data');
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

function draw(delta) {
    totalSeconds += delta;

    var vx = 100; // the background scrolls with a speed of 100 pixels/sec
    var numImages = Math.ceil(canvas.width / img.width) + 1;
    var xpos = totalSeconds * vx % img.width;

    context.save();
    context.translate(-xpos, 0);
    for (var i = 0; i < numImages; i++) {
        context.drawImage(img, i * img.width, 0);
    }
    context.restore();
}


function loadPanoroma(result) {

    var container = document.getElementById('my_tour');
    panorama_hero = new THREE.Panorama_hero(container);
    if (panorama_hero.panorama_possible) {
        var pathoffile = result.jsonTour.filepath;
        var finalfile = pathoffile.split('/');

        filepath = "/tour/property360/public/" + finalfile[1] + "/" + finalfile[2];
        //console.log(filepath)
        panorama_hero.from_JSON_file(filepath);
    }

}

function displayOverlayDetails(result) {
    document.getElementById('coverlogo').style.backgroundImage = "url('" + base_url + '/' + result.coverImage + "')";
    document.getElementById('propertyFor').innerHTML = result.propertyListType;

    var basePricePara = document.getElementById('propertyPrice');
    var priceString = (result.price).toString();
    var priceLength = priceString.length;
    if (priceLength == 4 || priceLength == 5) {
        var finalPrice = (result.price / 1000);
        basePricePara.innerHTML = '₹' + finalPrice + ' K';
    } else if (priceLength == 6 || priceLength == 7) {
        var finalPrice = (result.price / 100000);
        basePricePara.innerHTML = '₹' + finalPrice + ' Lacs';
    } else if (priceLength == 8 || priceLength == 9) {
        var finalPrice = (result.price / 10000000);
        basePricePara.innerHTML = '₹' + finalPrice + ' Cr';
    }
    var sqftprice = Math.round(result.price / result.saleableArea);
    document.getElementById('propertySquare').innerHTML = sqftprice;
    document.getElementById('propertyArea').innerHTML = result.saleableArea;
    if (result.furnished) {
        document.getElementById('furnished').innerHTML = result.furnished;
    } else { document.getElementById('furnished').innerHTML = 'NA' }
    document.getElementById('propertyTitle').innerHTML = result.title;
    document.getElementById('propertyLocation').innerHTML = '<i class="la la-map-marker"></i>' + result.location;
    document.getElementById('propertyOverview').innerHTML = result.overview;
    if (result.bedrooms) {
        document.getElementById('bedroom').innerHTML = result.bedrooms;
    } else { document.getElementById('bedroom').innerHTML = 'NA'; }
    if (result.bathrooms) {
        document.getElementById('bathrooms').innerHTML = result.bathrooms;
    } else { document.getElementById('bathrooms').innerHTML = 'NA' }
    if (result.balconies) {
        document.getElementById('balconies').innerHTML = result.balconies;
    } else { document.getElementById('balconies').innerHTML = 'NA'; }
    if (result.conditioning) {
        document.getElementById('conditioning').innerHTML = result.conditioning;
    } else { document.getElementById('conditioning').innerHTML = 'NA'; }
    var amenityValues = result.amenities;
    //console.log(amenityValues);
    for (var i = 0; i < amenityValues.length; i++) {
        var amenityList = document.createElement('li');
        var amenityDiv = document.createElement('div');
        var amenityImage = document.createElement('img');
        amenityImage.alt = "icon";
        amenityImage.src = base_url + '/' + amenityValues[i].image;
        amenityDiv.appendChild(amenityImage);
        var amenityDescription = document.createElement('div');
        var amenityPara = document.createElement('p');
        amenityPara.innerHTML = amenityValues[i].name;
        amenityDescription.appendChild(amenityPara);
        amenityList.appendChild(amenityDiv);
        amenityList.appendChild(amenityDescription);
        document.getElementById('/admin/amenities').appendChild(amenityList);

    }
    if ((result.latitude != 0.0) && (result.longitude != 0.0)) {
        initMap(result.latitude, result.longitude);
    } else {
        document.getElementById('map').style.display = "none";
        document.getElementById('mapnotfound').style.display = "block";
    }

}

function initMap(latitude, longitude) {
    var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 11
    });
    map.addControl(new mapboxgl.NavigationControl());
    marker = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);
    //console.log("inside google maps");
    // var uluru = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    // var map = new google.maps.Map(
    //     document.getElementById('map'), { zoom: 12, center: uluru });
    // var marker = new google.maps.Marker({ position: uluru, map: map });


}

var enquiry_form = document.getElementById('enquiry_form');
enquiry_form.addEventListener('submit', (event) => {
    if (enquiry_form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        //console.log("Form not valid")
    } else {
        event.preventDefault();
        enquiry_form.classList.add('was-validated');
        //console.log('Form is valid');
        var name = document.getElementById('enquiry_cust_name').value;
        var email = document.getElementById('enquiry_cust_email').value;
        var mobile = document.getElementById('enquiry_cust_phone').value;
        var comment = document.getElementById('enquiry_cust_comment').value;
        var datatosent = {
            "cname": name,
            "email": email,
            "mobile": mobile,
            "comment": comment,
            "propertyname": propertyTitle
        }
        $.ajax({
            url: base_url + "/enquiries/property/create",
            type: "post",
            data: (datatosent),
            success: function(result) {
                $("#form_submit_button").prop("disabled", false);
                $('#enquiry_form').remove();
                var thankyoudiv = document.createElement('div');
                thankyoudiv.innerHTML = '<h1>Thank You!</h1><br><br><p>We will get in touch with you</p>'
                document.getElementById('enquiry_div').appendChild(thankyoudiv);
                console.log('created successfully');
            },
            error: function(err) {
                $("#form_submit_button").prop("disabled", false);
                document.getElementById('errorinfo').innerHTML = 'Please Try Again.Response could not be Recorded'
                console.log('there was issue fetching the search tags');
            }
        });


    }
});

function set_scene(scene) {
    // var container = document.getElementById('my_tour');
    // var panorama_hero = new THREE.Panorama_hero(container);
    // var scene_filepath = filepath.replace('.json', '');
    // console.log(scene_filepath);
    // var p1 = panorama_hero.add_panorama(scene_filepath + "/360_3857.JPG");
    // var p2 = panorama_hero.add_panorama(scene_filepath + "/360_3862.JPG");
    // var p3 = panorama_hero.add_panorama(scene_filepath + "/360_3861.JPG");
    // if (scene == "livingroom") {
    //     p1.set_to_scene();
    // } else if (scene == "bathroom") {
    //     p3.set_to_scene();
    // } else {
    //     p2.set_to_scene();
    // }
    panorama_hero.set_panorama_by_id(scene);
}

function searchProperty() {
    //console.log('searching property');
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
        // if (location != "" || title != "" || tags != "") {
        //console.log('fetching property');
    $.ajax({
        url: base_url + "/propertylist/search",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(datatosent),
        success: function(result) {
            //console.log('custom search property data');
            document.getElementById('search_user').style.display = "block";
            document.getElementById('body').classList.add('search_body');
            if (result.list.length > 0) {
                $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>We could get ' + result.list.length + ' matching properties</div>');
                displayPropertyCards(result.list);
            } else {
                $('#panorama_container').empty();
                $('#footer').remove().clone(true).appendTo('#search_user');
                $('#panorama_overlay_container').empty();
                $('#cardDiv').empty();
                $('#bottom-fade').remove();
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
    //console.log(result);
    //console.log('creating cards');
    $('#panorama_container').empty();
    $('#footer').remove().clone(true).appendTo('#search_user');
    $('#panorama_overlay_container').empty();
    $('#bottom-fade').remove();
    var mainDiv = document.getElementById('cardDiv');
    $('#cardDiv').empty();
    for (var i = 0; i < result.length; i++) {
        var parentDiv = document.createElement('div');
        parentDiv.classList.add('col-lg-4', 'col-md-6');
        var cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.style.background = '#1e1e1e';
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
        anchorDiv.innerHTML = 'View in 360';
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

$('.block-container').mouseover(function() {
    $('.select2-selection__rendered').css('overflow-y', 'hidden');
    $('.select2-selection__rendered').css('height', 'auto');

});

$('.block-container').mouseout(function() {
    $('.select2-selection__rendered').css('overflow-y', 'scroll');
    $('.select2-selection__rendered').css('height', '37px');
});