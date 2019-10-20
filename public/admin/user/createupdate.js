 var base_url = "";
 //var base_url = "";
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
     if (user_id) {
         console.log('getting data');
         $.ajax({
             url: "/users/read/" + user_id,
             type: "get",
             success: function(result) {
                 document.getElementById('adminname').value = result.username;
                 document.getElementById('adminemail').value = result.email;
                 document.getElementById('adminmobile').value = result.mobile;
                 var imgdiv = document.getElementById('adminphoto');
                 var photodiv = document.createElement('img');
                 photodiv.src = '/' + result.image;
                 photodiv.style.width = "50px";
                 photodiv.alt = "Profile Pic";
                 imgdiv.appendChild(photodiv);
             },
             error: function(err) {
                 console.log('there was issue fetching the user');
             }
         });
     }
 }

 function saveUserChanges() {
     var form = $('#fileUploadForm')[0];
     var datatosent = new FormData(form);

     $("#form_submit_button").prop("disabled", true);

     if (user_id) {
         var today = new Date();
         datatosent.append("modifiedDate", today);
         $.ajax({
             url: "/users/update/" + user_id,
             type: "put",
             enctype: 'multipart/form-data',
             data: datatosent,
             processData: false,
             contentType: false,
             cache: false,
             success: function(result) {
                 $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>User updated successfully</div>')
                 $("#form_submit_button").prop("disabled", false);
                 $('#fileUploadForm').trigger("reset");
                 console.log('updated successfully');
             },
             error: function(err) {
                 $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Save UnSuccessful!</strong>User could not be updated.</div>');
                 $("#form_submit_button").prop("disabled", false);
                 console.log('there was issue updating the users');
             }
         });
     } else {
         $.ajax({
             url: "/users/create",
             type: "post",
             enctype: 'multipart/form-data',
             data: datatosent,
             processData: false,
             contentType: false,
             cache: false,
             success: function(result) {
                 if (result == "NotCreated") {
                     $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>UnSuccessful!</strong>Users could not be created</div>');
                     $("#form_submit_button").prop("disabled", false);
                     console.log('there was issue creating the users');
                 }
                 $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Users created successfully</div>');
                 $("#form_submit_button").prop("disabled", false);
                 $('#fileUploadForm').trigger("reset");
                 console.log('created successfully');
             },
             error: function(err) {
                 $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>UnSuccessful!</strong>Users could not be created</div>');
                 $("#form_submit_button").prop("disabled", false);
                 console.log('there was issue creating the users');
             }
         });
     }
 }