 $(document).ready(function() {
     $('.i-checks').iCheck({
         checkboxClass: 'icheckbox_square-green',
         radioClass: 'iradio_square-green',
     });
     var pageno = 1;
     var paginate = true;
     getEnquiries(pageno, paginate);
 });

 function getEnquiries(pageno, paginate) {
     $.ajax({
         url: "/enquiries/shoot/read?pagenumber=" + pageno,
         type: "get",
         success: function(result) {
             var enquiries = result.enquiry;
             var totalPages = result.totalpages;
             getShootEnquiriesList(enquiries, pageno);
             if (paginate == true) { createPagination(totalPages); }
         },
         error: function(err) {
             console.log('there was issue fetching the shoot enquiries');
         }
     });
 }


 function getShootEnquiriesList(result, pageno) {
     var slno = ((9 * pageno) - 9);
     var tbody = document.getElementById("shoot_enquiry_list");
     $("#shoot_enquiry_list").empty();
     for (i = 0; i < result.length; i++) {
         var row = tbody.insertRow(i);
         var cell1 = row.insertCell(0);
         cell1.innerHTML = i + 1 + slno;
         var cell2 = row.insertCell(1);
         cell2.id = result[i]._id;
         cell2.innerHTML = result[i].customername;
         var cell3 = row.insertCell(2);
         cell3.innerHTML = result[i].email;
         var cell4 = row.insertCell(3);
         cell4.innerHTML = result[i].mobile;
         var cell5 = row.insertCell(4);
         cell5.innerHTML = result[i].address;
         var cell6 = row.insertCell(5);
         var enquiry_id = result[i]._id;
         var index = i;
         cell6.innerHTML = '<a title="Delete" style="color:red;" href="#!"><i class="fa fa-trash-o" aria-hidden="true"></i></a>';
         cell6.onclick = (function(enquiry_id, index) {
             return function() { deleteEnquiry(enquiry_id), index; }
         })(enquiry_id, index);

     }


 }

 function deleteEnquiry(enquiry_id, index) {
     var txt;
     var r = confirm("Are you sure?");
     if (r == true) {
         $.ajax({
             url: "/enquiries/shoot/delete/" + enquiry_id,
             type: "delete",
             success: function(result) {
                 $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Deleted successfully</div>');
                 document.getElementById('shoot_enquiry_list').deleteRow(index);
             },
             error: function(err) {
                 $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong>Could not Delete the Enquiry</div>');
                 console.log('there was issue deleting the shoot enquiry');
             }
         });

     } else {
         $("#alert_placeholder").html('<div class="alert alert-info alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Unsuccessfull</strong>Action Cancelled</div>');

     }

 }

 function createPagination(totalPages) {
     var paginate = document.getElementById('paginatebutton');
     document.getElementById("prevpage").addEventListener("click", function(e) {
         console.log('previouspage');
         var currentpageno = $('#paginatebutton').find('.active').val();
         $('#paginatebutton li.active').prev().addClass('active').siblings().removeClass('active');
         var pageno = $('#paginatebutton').find('.active').val();
         var paginate = false;
         if (currentpageno != pageno) { getEnquiries(pageno, paginate); }
     });
     document.getElementById("nextpage").addEventListener("click", function(e) {
         console.log('nextpage');
         var currentpageno = $('#paginatebutton').find('.active').val();
         $('#paginatebutton li.active').next().addClass('active').siblings().removeClass('active');
         var pageno = $('#paginatebutton').find('.active').val();
         var paginate = false;
         if (currentpageno != pageno) { getEnquiries(pageno, paginate); }
     });
     var pagebutton = document.createElement('li');
     pagebutton.classList.add('btn', 'btn-white', 'active');
     pagebutton.innerHTML = 1;
     pagebutton.value = 1;
     var pageno = 1;
     pagebutton.onclick = (function(pageno) {
         return function() {
             $(this).addClass('active').siblings().removeClass('active');
             var paginate = false;
             getEnquiries(pageno, paginate);
         }
     })(pageno);
     paginate.appendChild(pagebutton);

     for (var i = 1; i < totalPages; i++) {
         var pagebutton = document.createElement('li');
         pagebutton.classList.add('btn', 'btn-white');
         pagebutton.innerHTML = i + 1;
         pagebutton.value = i + 1;
         var pageno = i + 1;
         pagebutton.onclick = (function(pageno) {
             return function() {
                 $(this).addClass('active').siblings().removeClass('active');
                 var paginate = false;
                 getEnquiries(pageno, paginate);
             }
         })(pageno);
         paginate.appendChild(pagebutton);
     }
 }

 function searchShootEnquiry() {
     var pageno = 1;
     var toSearch = document.getElementById('searchShootEnquiry').value;
     $.ajax({
         url: "/enquiries/shoot/custom/search?text=" + toSearch,
         type: "get",
         success: function(result) {
             var enquiryRecords = result.enquiries;
             getShootEnquiriesList(enquiryRecords, pageno);
         },
         error: function(err) {
             console.log('there was issue fetching the enquiries');
         }
     });
 }

 function clearEnquiries() {
     var pageno = 1;
     var paginate = false;
     document.getElementById('searchShootEnquiry').value = "";
     getEnquiries(pageno, paginate);
 }