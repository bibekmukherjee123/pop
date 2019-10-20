$(document).ready(function() {
    $(".prop-info-link").click(function() {
        $(".property-details-overlay").addClass("open");
    });

    $(".body_content, .search-button-wrapper a").click(function() {
        $(".prop-type-dropdown").hide();
        $(".budget-dropdown").hide();
    });

    $(".property-type-box").click(function() {
        $(".prop-type-dropdown").toggle();
        event.stopPropagation();
        $(".budget-dropdown").hide();
    });

    $(".budget-box").click(function() {
        $(".budget-dropdown").toggle();
        event.stopPropagation();
        $(".prop-type-dropdown").hide();
    });

    $(".search-button-wrapper").click(function() {
        $(".select2-selection__rendered li").css({ "white-space": "inherit", "width": "27%" });
    });
    $(".close-info-link").click(function() {
        $(".property-details-overlay").removeClass("open");
    });

    $('.footer_blog').click(function() {
        var status = $(this).attr('class');

        if(status != 'footer_blog'){
            $(this).removeClass('active');
        }
        else{
            $(this).addClass('active');
        }
    });

    getSiteMeta();

});

$(document).ready(function() {
    $(".search_menu").click(function() {
        $(".max_screen").toggle();
    });
});

function getSiteMeta() {
    $.ajax({
        url: "/settings/read",
        type: "get",
        success: function(result) {
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