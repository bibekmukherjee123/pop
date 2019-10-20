$(document).ready(function() {
    getSiteMeta();

});

function getSiteMeta() {
    $.ajax({
        url: "/settings/read",
        type: "get",
        success: function(result) {
            console.log(result);
            if (result.length > 0) {
                document.querySelector('meta[name="description"]').setAttribute("content", result[0].homeMetaDescription);
                document.title = result[0].homeMetaTitle;
            }

        },
        error: function(err) {
            console.log('there was issue fetching the Meta');
        }
    });
}