 var base_url = '';


 $(document).ready(function() {
     $('.i-checks').iCheck({
         checkboxClass: 'icheckbox_square-green',
         radioClass: 'iradio_square-green',
     });

     $('.summernote').summernote();


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
     if (blog_id) {
         console.log('getting data');
         $.ajax({
             url: "/blog/read/" + blog_id,
             type: "get",
             success: function(result) {
                 document.getElementById('blogtitle').value = result.title;
                 $('#blogshortdes').summernote('code', result.shortDescription);
                 $('#bloglongdes').summernote('code', result.longDescription);
                 document.getElementById('dlink').value = result.downloadLink;
                 document.getElementById('alttag').value = result.imageTag;
                 var imgdiv = document.getElementById('blog_image');
                 var photodiv = document.createElement('img');
                 photodiv.src = base_url + '/' + result.image;
                 photodiv.style.width = "50px";
                 photodiv.alt = "Blog Image";
                 imgdiv.appendChild(photodiv);
             },
             error: function(err) {
                 console.log('there was issue fetching the Property List');
             }
         });
     }
 }


 function saveBlogDetails() {

     var title = document.getElementById('blogtitle').value;
     var shortdescription = $('#blogshortdes').summernote('code');
     var longDescription = $('#bloglongdes').summernote('code');
     var dlink = document.getElementById('dlink').value;
     var imagetag = document.getElementById('alttag').value;
     var blobimage = "";
     if (document.getElementById("blobcoverimage").files.length == 0) {
         console.log("no files selected");
         blobimage = "";
     } else {
         blobimage = $('#blobcoverimage').prop('files')[0];
     }
     var datatosent = {
         "title": title,
         "shortDescription": shortdescription,
         "longDescription": longDescription,
         "downloadLink": dlink,
         "imageTag": imagetag
     }


     if (title != "") {
         //$("#form_submit_button").prop("disabled", true);
         if (blog_id) {
             var today = new Date();
             var fd = new FormData();
             fd.append('blogimage', blobimage);
             $.each(datatosent, function(key, value) {
                 fd.append(key, value);
             })
             fd.append("modifiedDate", today);
             $.ajax({
                 url: "/blog/update/" + blog_id,
                 type: "put",
                 enctype: 'multipart/form-data',
                 data: fd,
                 processData: false,
                 contentType: false,
                 cache: false,
                 success: function(result) {
                     $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Blog updated successfully</div>')
                     $("#form_submit_button").prop("disabled", false);
                     $('#fileUploadForm').trigger("reset");
                     console.log('updated successfully');
                 },
                 error: function(err) {
                     $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Save UnSuccessful!</strong>Blog could not be updated.</div>');
                     $("#form_submit_button").prop("disabled", false);
                     console.log('there was issue updating the Blog');
                 }
             });
         } else {
             console.log('inside create');
             var fd = new FormData();
             fd.append('blogimage', blobimage);
             $.each(datatosent, function(key, value) {
                 fd.append(key, value);
             })
             $.ajax({
                 url: "/blog/create",
                 type: "post",
                 enctype: 'multipart/form-data',
                 data: fd,
                 processData: false,
                 contentType: false,
                 cache: false,
                 success: function(result) {
                     $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Blog created successfully</div>');
                     $("#form_submit_button").prop("disabled", false);
                     $('#fileUploadForm').trigger("reset");
                     console.log('created successfully');
                 },
                 error: function(err) {
                     $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>UnSuccessful!</strong>Blog could not be created</div>');
                     $("#form_submit_button").prop("disabled", false);
                     console.log('there was issue creating the Blog List');
                 }
             });
         }

     } else {
         $("#form_submit_button").prop("disabled", false);
         $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>UnSuccessful! </strong>Required Fields Value Missing</div>')

     }


 }