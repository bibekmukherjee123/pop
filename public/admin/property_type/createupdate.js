 $(document).ready(function() {
     $('.i-checks').iCheck({
         checkboxClass: 'icheckbox_square-green',
         radioClass: 'iradio_square-green',
     });
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
 window.onload = function() {
     if (type_id) {
         console.log('getting data');
         $.ajax({
             url: "/propertytypes/read/" + type_id,
             type: "get",
             success: function(result) {
                 document.getElementById('property_type_name').value = result.name;
             },
             error: function(err) {
                 console.log('there was issue fetching the property types');
             }
         });
     }
 }

 function savePropertyType() {
     $("#form_submit_button").prop("disabled", true);

     if (type_id) {
         var date = new Date();
         var property_name = document.getElementById('property_type_name').value;
         var datatosent = {
             "name": property_name,
             "modifiedDate": date
         }
         $.ajax({
             url: "/propertytypes/update/" + type_id,
             type: "put",
             data: datatosent,
             success: function(result) {
                 $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Property Type updated successfully</div>')
                 $("#form_submit_button").prop("disabled", false);
                 console.log('updated successfully');
             },
             error: function(err) {
                 $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Save UnSuccessful!</strong>Property Type could not be updated.</div>');
                 $("#form_submit_button").prop("disabled", false);
                 console.log('there was issue updating the property types');
             }
         });
     } else {
         var property_name = document.getElementById('property_type_name').value;
         $.ajax({
             url: "/propertytypes/create",
             type: "post",
             data: {
                 "name": property_name
             },
             success: function(result) {
                 $('#fileUploadForm').trigger("reset");
                 $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Property Type created successfully</div>');
                 $("#form_submit_button").prop("disabled", false);
                 console.log('created successfully');
             },
             error: function(err) {
                 $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>UnSuccessful!</strong>Property Type could not be created</div>');
                 $("#form_submit_button").prop("disabled", false);
                 console.log('there was issue fetching the property types');
             }
         });
     }
 }