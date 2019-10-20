 var base_url = "";
 var socialid = "";
 $(document).ready(function() {
     $('.i-checks').iCheck({
         checkboxClass: 'icheckbox_square-green',
         radioClass: 'iradio_square-green',
     });
     $.ajax({
         url: "/social/read",
         type: "get",
         success: function(result) {
             if (result.length > 0) {
                 displaySocialSettings(result);
                 socialid = result._id;
             }
         },
         error: function(err) {
             console.log('there was issue fetching the Users');
         }
     });
 });

 function displaySocialSettings(result) {
     console.log(result);
     document.getElementById('sociallinkedin').value = result[0].linkedin;
     document.getElementById('socialfacebook').value = result[0].facebook;
     document.getElementById('socialtwitter').value = result[0].twitter;
     document.getElementById('socialpinterest').value = result[0].pinterest;
     document.getElementById('socialinstagram').value = result[0].instagram;
     document.getElementById('socialyoutube').value = result[0].youtube;

 }

 function saveSocialChanges() {
     var form = $('#fileUploadForm')[0];
     var datatosent = new FormData(form);

     $("#form_submit_button").prop("disabled", true);

     var today = new Date();
     datatosent.append("modifiedDate", today);
     $.ajax({
         url: "/social/update/" + socialid,
         type: "put",
         enctype: 'multipart/form-data',
         data: datatosent,
         processData: false,
         contentType: false,
         cache: false,
         success: function(result) {
             $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Social Settings updated successfully</div>')
             $("#form_submit_button").prop("disabled", false);
             console.log('updated successfully');
         },
         error: function(err) {
             $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Save UnSuccessful!</strong>Social Settings could not be updated.</div>');
             $("#form_submit_button").prop("disabled", false);
             console.log('there was issue updating the settings');
         }
     });
 }