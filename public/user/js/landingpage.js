var enquiry_form = document.getElementById('enquiry_form');
enquiry_form.addEventListener('submit', (event) => {
    if (enquiry_form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        console.log("Form not valid")
    } else {
        event.preventDefault();
        enquiry_form.classList.add('was-validated');
        console.log('Form is valid');
        var name = document.getElementById('shoot_cust_name').value;
        var email = document.getElementById('shoot_cust_email').value;
        var mobile = document.getElementById('shoot_cust_phone').value;
        var address = document.getElementById('shoot_cust_address').value;
        var datatosent = {
                "cname": name,
                "email": email,
                "mobile": mobile,
                "address": address,
            }
            //console.log(datatosent);
        $.ajax({
            url: "/enquiries/shoot/create",
            type: "post",
            data: (datatosent),
            success: function(result) {
                $("#form_submit_button").prop("disabled", false);
                $('#enquiry_form').remove();
                var thankyoudiv = document.createElement('div');
                thankyoudiv.style.marginLeft = "30px";
                thankyoudiv.innerHTML = '<h1>Thank You!</h1><br><br><p>We will get in touch with you</p>'
                document.getElementById('enquiry_div').appendChild(thankyoudiv);
                console.log('created successfully');
            },
            error: function(err) {
                $("#form_submit_button").prop("disabled", false);
                document.getElementById('errorinfo').innerHTML = 'Please Try Again.Response could not be Recorded'
                console.log('there was issue fetching the search tags');
            }
        });
    }
});

// var info_enquiry = document.getElementById('info_enquiry');
// info_enquiry.addEventListener('submit', (event) => {
//     if (info_enquiry.checkValidity() === false) {
//         event.preventDefault();
//         event.stopPropagation();
//         console.log("Form not valid")
//     } else {
//         event.preventDefault();
//         info_enquiry.classList.add('was-validated');
//         console.log('Form is valid');
//         var name = "Not Provided";
//         var email = document.getElementById('info_email').value;
//         var mobile = document.getElementById('info_phone').value;
//         var address = document.getElementById('info_message').value;
//         var datatosent = {
//                 "cname": name,
//                 "email": email,
//                 "mobile": mobile,
//                 "address": address,
//             }
//             //console.log(datatosent);
//         $.ajax({
//             url: "/enquiries/shoot/create",
//             type: "post",
//             data: (datatosent),
//             success: function(result) {
//                 $("#info_submit_button").prop("disabled", false);
//                 $('#info_enquiry').remove();
//                 var thankyoudiv = document.createElement('div');
//                 thankyoudiv.style.marginLeft = "45px";
//                 thankyoudiv.innerHTML = '<h1>Thank You!</h1><br><br><p>We will get in touch with you</p>'
//                 document.getElementById('info_div').appendChild(thankyoudiv);
//                 console.log('created successfully');
//             },
//             error: function(err) {
//                 $("#info_submit_button").prop("disabled", false);
//                 document.getElementById('errorinfo').innerHTML = 'Please Try Again.Response could not be Recorded'
//                 console.log('there was issue fetching the search tags');
//             }
//         });
//     }
// })