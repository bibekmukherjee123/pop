//xconsole.log(type_id);
//var type_id;
var base_url = '';
//var base_url = "";
$(document).ready(function() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
});

// var getUrlParameter = function getUrlParameter(sParam) {
//     var sPageURL = window.location.search.substring(1),
//         sURLVariables = sPageURL.split('&'),
//         sParameterName,
//         i;

//     for (i = 0; i < sURLVariables.length; i++) {
//         sParameterName = sURLVariables[i].split('=');

//         if (sParameterName[0] === sParam) {
//             return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
//         }
//     }
// };
//var type_id;
window.onload = function() {
    if (type_id) {
        console.log('getting data');
        $.ajax({
            url: "/amenities/read/" + type_id,
            type: "get",
            success: function(result) {
                document.getElementById('amenities_name').value = result.name;
                var imageDiv = document.getElementById('amenityimage');
                var amenityImage = document.createElement('img');
                amenityImage.src = '/' + result.image;
                amenityImage.style.width = "50px";
                amenityImage.alt = "Amenity Icon";
                imageDiv.appendChild(amenityImage);
                document.getElementById('image_tag').value = result.imageTag;
            },
            error: function(err) {
                console.log('there was issue fetching the amenities');
            }
        });
    }
}

function saveAmenities() {
    var form = $('#fileUploadForm')[0];
    var datatosent = new FormData(form);

    $("#form_submit_button").prop("disabled", true);

    if (type_id) {
        var today = new Date();
        datatosent.append("modifiedDate", today);
        $.ajax({
            url: "/amenities/update/" + type_id,
            type: "put",
            enctype: 'multipart/form-data',
            data: datatosent,
            processData: false,
            contentType: false,
            cache: false,
            success: function(result) {
                $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Amenities updated successfully</div>')
                $("#form_submit_button").prop("disabled", false);
                $('#fileUploadForm').trigger("reset");
                console.log('updated successfully');
            },
            error: function(err) {
                $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Save UnSuccessful!</strong>Amenities could not be updated.</div>');
                $("#form_submit_button").prop("disabled", false);
                console.log('there was issue updating the amenities');
            }
        });
    } else {
        $.ajax({
            url: "/amenities/create",
            type: "post",
            enctype: 'multipart/form-data',
            data: datatosent,
            processData: false,
            contentType: false,
            cache: false,
            success: function(result) {
                $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Amenities created successfully</div>');
                $("#form_submit_button").prop("disabled", false);
                $('#fileUploadForm').trigger("reset");
                console.log('created successfully');
            },
            error: function(err) {
                $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>UnSuccessful!</strong>Amenities could not be created</div>');
                $("#form_submit_button").prop("disabled", false);
                console.log('there was issue creating the amenities');
            }
        });
    }
}