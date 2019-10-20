 var base_url = '';
 //var base_url = 'http://localhost:1234';
 var list_id;
 mapboxgl.accessToken = "pk.eyJ1IjoiYWJoaXNoZWswNSIsImEiOiJjanpkdHJoY2YwMmZuM21xbTVweXZndHczIn0.yHFLb4I5gBe5pRwCishEvA";

 $(document).ready(function() {
     $('.i-checks').iCheck({
         checkboxClass: 'icheckbox_square-green',
         radioClass: 'iradio_square-green',
     });

     $(".select2_demo_1").select2();
     //  $(".select2_demo_2").select2();
     //  $(".select2_demo_3").select2({
     //      placeholder: "Select a state",
     //      allowClear: true
     //  });
     $(".select2_demo_4").select2();

     $(".select2_demo_5").select2();

     // $('.dual_select').bootstrapDualListbox({
     //     selectorMinimalHeight: 160
     // });

     //$('.chosen-select').chosen({ width: "100%" });

     $('.summernote').summernote();
     document.getElementById('latitude').value = 0.0;
     document.getElementById('longitude').value = 0.0;

     $.ajax({
         url: "/amenities/list/",
         type: "get",
         success: function(result) {
             console.log('fetched Amenities data');
             for (var i = 0; i < result.length; i++) {
                 $('<option>').val(result[i]._id).text(result[i].name).appendTo('#amenitis_option');
                 //  $("#myselect option[value=3]").attr('selected', 'selected');

             }
             //  $("#amenitis_option").trigger("chosen:updated");

         },
         error: function(err) {
             console.log('there was issue fetching the Amenities');
         }
     });
     $.ajax({
         url: "/propertytypes/list/",
         type: "get",
         success: function(result) {
             console.log('fetched property types data');
             for (var i = 0; i < result.length; i++) {
                 $('<option>').val(result[i]._id).text(result[i].name).appendTo('#propertyType');

             }

         },
         error: function(err) {
             console.log('there was issue fetching the property types');
         }
     });

     $.ajax({
         url: "/searchtags/list/",
         type: "get",
         success: function(result) {
             console.log('fetched searchtags  data');
             for (var i = 0; i < result.length; i++) {
                 $('<option>').val(result[i]._id).text(result[i].name).appendTo('#searchTags');
             }
             //   $("#searchTags").trigger("chosen:updated");

         },
         error: function(err) {
             console.log('there was issue fetching the searchtags');
         }
     });

     $.ajax({
         url: "/jsontours/read/",
         type: "get",
         success: function(result) {
             console.log('fetched jsontours  data');
             for (var i = 0; i < result.length; i++) {

                 $('<option>').val(result[i]._id).text(result[i].title).appendTo('#json_tour');
             }
             // $("#json_tour").trigger("chosen:updated");

         },
         error: function(err) {
             console.log('there was issue fetching the jsontours');
         }
     });

     if (list_id) {
         console.log('getting data');
         $.ajax({
             url: "/propertylist/read/" + list_id,
             type: "get",
             success: function(result) {
                 displayPropertyDetails(result);
             },
             error: function(err) {
                 console.log('there was issue fetching the Property List');
             }
         });
     }
 });

 //  var getUrlParameter = function getUrlParameter(sParam) {
 //      var sPageURL = window.location.search.substring(1),
 //          sURLVariables = sPageURL.split('&'),
 //          sParameterName,
 //          i;

 //      for (i = 0; i < sURLVariables.length; i++) {
 //          sParameterName = sURLVariables[i].split('=');

 //          if (sParameterName[0] === sParam) {
 //              return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
 //          }
 //      }
 //  };

 function displayPropertyDetails(result) {
     console.log(result);
     document.getElementById('listtitle').value = result.title;
     $("#propertyType").select2("val", result.propertyType._id);
     $('#propertyType').trigger('change');
     $("#json_tour").select2("val", result.jsonTour._id);
     $('#json_tour').trigger('change');
     if (result.propertyListType == 'Sale') {
         $("#sale").prop('checked', true).iCheck('update');

     } else {
         $("#rent").prop("checked", true).iCheck('update');

     }
     document.getElementById('address').value = result.location;
     if (result.latitude) { document.getElementById('latitude').value = result.latitude; }
     if (result.longitude) { document.getElementById('longitude').value = result.longitude; }
     var amentiesIds = [];
     console.log(result.amenities);
     for (var i = 0; i < result.amenities.length; i++) {
         amentiesIds.push(result.amenities[i]._id);
     }
     $("#amenitis_option").select2("val", amentiesIds);
     $('#amenitis_option').trigger('change');
     var tagsIds = [];
     for (var i = 0; i < result.propertyTags.length; i++) {
         tagsIds.push(result.propertyTags[i]._id);
     }
     $("#searchTags").select2("val", tagsIds);
     $('#searchTags').trigger('change');
     $('#list_property_description').summernote('code', result.overview);
     document.getElementById('hira').value = result.hiraNumber;
     document.getElementById('saleable').value = result.saleableArea;
     var priceString = (result.price).toString();
     var priceLength = priceString.length;
     if (priceLength == 4 || priceLength == 5) {
         var finalPrice = (result.price / 1000);
         document.getElementById('price').value = finalPrice;
         $("#currency").select2("val", "1000");
     } else if (priceLength == 6 || priceLength == 7) {
         var finalPrice = (result.price / 100000);
         document.getElementById('price').value = finalPrice;
         $("#currency").select2("val", "100000");
     } else if (priceLength == 8 || priceLength == 9) {
         var finalPrice = (result.price / 10000000);
         document.getElementById('price').value = finalPrice;
         $("#currency").select2("val", "10000000");
     }
     $('#currency').trigger('change');
     $("#bedrooms").select2("val", result.bedrooms);
     $('#bedrooms').trigger('change');
     $("#bathroom").select2("val", result.bathrooms);
     $('#bathroom').trigger('change');
     document.getElementById('balconies').value = result.balconies;
     if (result.conditioning == 'Window') {
         $("#window").prop('checked', true).iCheck('update');
     } else if (result.conditioning == 'Split') {
         $("#split").prop("checked", true).iCheck('update');
     } else if (result.conditioning == 'Centralised') {
         $("#centralised").prop("checked", true).iCheck('update');
     }
     if (result.furnished == 'Non-furnished') {
         $("#nonfurnished").prop('checked', true).iCheck('update');
     } else if (result.furnished == 'Semi-furnished') {
         $("#semifurnished").prop("checked", true).iCheck('update');
     } else if (result.furnished == 'Fully-Furnished') {
         $("#fullyfurnished").prop("checked", true).iCheck('update');
     }
     var coverimgdiv = document.getElementById('coverimagediv');
     var coveranchor = document.createElement("a");
     coveranchor.href = base_url + '/' + result.coverImage;
     coveranchor.target = "_blank";
     var coverphotodiv = document.createElement('img');
     coverphotodiv.src = base_url + '/' + result.coverImage;
     coverphotodiv.style.width = "50px";
     coverphotodiv.alt = "Property Cover";
     coveranchor.appendChild(coverphotodiv);
     coverimgdiv.appendChild(coveranchor);

     var logoimgdiv = document.getElementById('logoimagediv');
     var logoanchor = document.createElement('a');
     logoanchor.href = base_url + '/' + result.logo;
     logoanchor.target = "_blank";
     var logophotodiv = document.createElement('img');
     logophotodiv.src = base_url + '/' + result.logo;
     logophotodiv.alt = "No Logo Image"
     logophotodiv.style.width = "50px";
     logophotodiv.alt = "Property Logo";
     logoanchor.appendChild(logophotodiv);
     logoimgdiv.appendChild(logoanchor);
 }
 //var latitude, longitude;

 function savePropertyList() {

     var title = document.getElementById('listtitle').value;
     var propertyType = $("#propertyType").val();
     var jsonTour = $("#json_tour").val();
     var propertyListType = $('input[name=propertyListType]:checked').val();
     var location = document.getElementById('address').value;
     var amenitiesSelected = $("#amenitis_option").val();
     //var amenityjson = createJson(amenitiesSelected);
     var searchTagsSelected = $("#searchTags").val();
     //var tagsjson = createJson(searchTagsSelected);
     var description = $('#list_property_description').summernote('code');
     var hiranumber = document.getElementById('hira').value;
     var coverlogo = "";
     if (document.getElementById("inputImagecover").files.length == 0) {
         console.log("no files selected");
         coverlogo = "";
     } else {
         coverlogo = $('#inputImagecover').prop('files')[0];
     }
     if (document.getElementById("inputImagelogo").files.length == 0) {
         console.log("no files selected");
         logo = "";
     } else {
         logo = $('#inputImagelogo').prop('files')[0];
     }
     var bedroom = $("#bedrooms").val();
     var bathroom = $("#bathroom").val();
     var balconies = document.getElementById('balconies').value;
     var airconditioning = $('input[name=conditioningType]:checked').val();
     var furnished = $('input[name=furnishingListType]:checked').val();
     var saleable = document.getElementById('saleable').value;
     var price = document.getElementById('price').value;
     var currency = $("#currency").val();
     var finalPrice = price * currency;
     var latitude = document.getElementById('latitude').value;
     var longitude = document.getElementById('longitude').value;
     var datatosent = {
         "listname": title,
         "propertyType": propertyType,
         "jsonTour": jsonTour,
         "propertyListType": propertyListType,
         "location": location,
         "amenities": JSON.stringify(amenitiesSelected),
         "propertyTags": JSON.stringify(searchTagsSelected),
         "overview": description,
         "hiranumber": hiranumber,
         "bedrooms": bedroom,
         "bathrooms": bathroom,
         "balconies": balconies,
         "conditioning": airconditioning,
         "furnished": furnished,
         "price": finalPrice,
         "saleable": saleable,
         "lat": latitude,
         "long": longitude
             // "coverlogo": coverlogo,
             // "logo": logo
     }


     if (title != "" && propertyType != null && propertyListType != null && location != "" && description != "") {
         //$("#form_submit_button").prop("disabled", true);

         if (list_id) {
             var fd = new FormData();
             fd.append('coverlogo', coverlogo);
             fd.append('logo', logo);
             // fd.append('lat', latitude);
             //fd.append('long', longitude);
             $.each(datatosent, function(key, value) {
                 fd.append(key, value);
             })
             var today = new Date();
             fd.append("modifiedDate", today);
             console.log(fd);
             $.ajax({
                 url: "/propertylist/update/" + list_id,
                 type: "put",
                 enctype: 'multipart/form-data',
                 data: fd,
                 processData: false,
                 contentType: false,
                 cache: false,
                 success: function(result) {
                     $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Property List updated successfully</div>')
                     $("#form_submit_button").prop("disabled", false);
                     console.log('updated successfully');
                 },
                 error: function(err) {
                     $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Save UnSuccessful!</strong>Property List could not be updated.</div>');
                     $("#form_submit_button").prop("disabled", false);
                     console.log('there was issue updating the Property List');
                 }
             });
         } else {
             console.log('inside create');
             var fd = new FormData();
             fd.append('coverlogo', coverlogo);
             fd.append('logo', logo);
             $.each(datatosent, function(key, value) {
                 fd.append(key, value);
             })
             $.ajax({
                 url: "/propertylist/create",
                 type: "post",
                 enctype: 'multipart/form-data',
                 data: fd,
                 processData: false,
                 contentType: false,
                 cache: false,
                 success: function(result) {
                     $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Property List created successfully</div>');
                     $("#form_submit_button").prop("disabled", false);
                     $('#fileUploadForm').trigger("reset");
                     $(".select2_demo_1").select2('val', '');
                     $(".select2_demo_4").select2('val', '');
                     $(".select2_demo_5").select2('val', '');
                     // $("#propertyType").select2('val', '');
                     console.log('created successfully');
                 },
                 error: function(err) {
                     $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>UnSuccessful!</strong>Property List could not be created</div>');
                     $("#form_submit_button").prop("disabled", false);
                     console.log('there was issue creating the Property List');
                 }
             });
         }

     } else {
         $("#form_submit_button").prop("disabled", false);
         $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>UnSuccessful! </strong>Required Fields Value Missing</div>')

     }
 }

 var marker;

 function getCordinates() {
     console.log("inside google maps");
     var location = document.getElementById("address").value;

     var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
     var map = new mapboxgl.Map({
         container: 'map',
         style: 'mapbox://styles/mapbox/streets-v11',
         center: [88.3639, 22.5726],
         zoom: 10
     });
     map.addControl(new mapboxgl.NavigationControl());
     mapboxClient.geocoding.forwardGeocode({
             query: location,
             autocomplete: false,
             limit: 1
         })
         .send()
         .then(function(response) {
             if (response && response.body && response.body.features && response.body.features.length) {
                 var feature = response.body.features[0];
                 marker = new mapboxgl.Marker({ draggable: true })
                     .setLngLat(feature.center)
                     .addTo(map);

                 marker.on('dragend', onDragEnd);
             } else {
                 $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Save UnSuccessful!</strong>Please check address.Property could not be located.</div>');
                 document.getElementById('latitude').value = 0.0;
                 document.getElementById('longitude').value = 0.0;

             }
         })
         .catch(function(err) {
             console.log("API ERROR");
         });
 }

 function onDragEnd() {
     var lngLat = marker.getLngLat();
     document.getElementById('latitude').value = lngLat.lat;
     document.getElementById('longitude').value = lngLat.lng;
 }