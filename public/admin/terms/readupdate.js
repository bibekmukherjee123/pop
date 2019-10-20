var terms_id = 0;
$(document).ready(function() {

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });


    $(".select2_demo_1").select2();
    $(".select2_demo_2").select2();
    $(".select2_demo_3").select2({
        placeholder: "Select a state",
        allowClear: true
    });


    $('.chosen-select').chosen({
        width: "100%"
    });


    $('.summernote').summernote();
    $.ajax({
        url: "/terms/read",
        type: "get",
        success: function(result) {
            if (result.length > 0) {
                terms_id = result[0]._id;
                console.log('terms data fetched successfully');
                $('.summernote').summernote('code', result[0].description);
            }

        },
        error: function(err) {
            $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong>There was an issue retrieving the terms details</div>');
            console.log('there was issue retreiving  the  terms details');
        }
    });




});

function saveTermsConditions() {
    var htmlcode = $('#note_terms').summernote('code');
    var today = new Date();
    $.ajax({
        url: "/terms/update/" + terms_id,
        type: "put",
        data: {
            "description": htmlcode,
            "modifiedDate": today
        },
        success: function(result) {
            $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Terms & Conditions updated successfully</div>');
            console.log('updated successfully');
        },
        error: function(err) {
            $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>UnSuccessful!</strong>Update Unsuccessful</div>');
            console.log('there was issue saving the  terms');
        }
    });
}