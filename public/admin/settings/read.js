 var base_url = "";
 //var base_url = "http://localhost:1234" 
 var settingsid = "";
 $(document).ready(function() {
     $('.i-checks').iCheck({
         checkboxClass: 'icheckbox_square-green',
         radioClass: 'iradio_square-green',
     });
     $.ajax({
         url: "/settings/read",
         type: "get",
         success: function(result) {
             if (result.length > 0) {
                 displaySettings(result);
                 settingsid = result[0]._id;
             }

         },
         error: function(err) {
             console.log('there was issue fetching the Users');
         }
     });
 });

 function displaySettings(result) {
     document.getElementById('site_name').value = result[0].sitename;
     document.getElementById('admin_email').value = result[0].adminemail;
     document.getElementById('site_url').value = result[0].siteurl;
     document.getElementById('contact_meta_title').value = result[0].contactMetaTitle;
     document.getElementById('contact_meta_description').value = result[0].contactMetaDescription;
     document.getElementById('home_meta_title').value = result[0].homeMetaTitle;
     document.getElementById('home_meta_description').value = result[0].homeMetaDescription;
     var logodiv = document.getElementById('site_logo');
     var logoimage = document.createElement('img');
     logoimage.src = '/' + result[0].sitelogo;
     logoimage.style.width = "50px";
     logoimage.alt = "Logo Pic";
     logodiv.appendChild(logoimage);
     var favicondiv = document.getElementById('favicon_logo');
     var faviconimage = document.createElement('img');
     faviconimage.src = '/' + result[0].favicon;
     faviconimage.style.width = "50px";
     faviconimage.alt = "Favicon";
     favicondiv.appendChild(faviconimage);
     var adminlogodiv = document.getElementById('admin_logo');
     var adminlogoimage = document.createElement('img');
     adminlogoimage.src = '/' + result[0].adminlogo;
     adminlogoimage.style.width = "50px";
     adminlogoimage.alt = "Admin Logo";
     adminlogodiv.appendChild(adminlogoimage);


 }

 function saveSettingsChanges() {
     var form = $('#fileUploadForm')[0];
     var datatosent = new FormData(form);

     $("#form_submit_button").prop("disabled", true);

     var today = new Date();
     datatosent.append("modifiedDate", today);
     $.ajax({
         url: "/settings/update/" + settingsid,
         type: "put",
         enctype: 'multipart/form-data',
         data: datatosent,
         processData: false,
         contentType: false,
         cache: false,
         success: function(result) {
             $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Settings updated successfully</div>')
             $("#form_submit_button").prop("disabled", false);
             console.log('updated successfully');
         },
         error: function(err) {
             $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Save UnSuccessful!</strong>Settings could not be updated.</div>');
             $("#form_submit_button").prop("disabled", false);
             console.log('there was issue updating the settings');
         }
     });
 }