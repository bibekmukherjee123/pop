 var base_url = "";
 var image_url = "";
 //ar base_url = "";
 //var image_url = "";
 $(document).ready(function() {
     $('.i-checks').iCheck({
         checkboxClass: 'icheckbox_square-green',
         radioClass: 'iradio_square-green',
     });
     var pageno = 1;
     var paginate = true;
     getAmenities(pageno, paginate);
 });

 function getAmenities(pageno, paginate) {
     $.ajax({
         url: "/amenities/read?pagenumber=" + pageno,
         type: "get",
         success: function(result) {
             //console.log(result);
             var amenityrecords = result.amenity;
             var totalPages = result.totalpages;
             getAmenitiesList(amenityrecords, pageno);
             if (paginate == true) { createPagination(totalPages); }
         },
         error: function(err) {
             console.log('there was issue fetching the amenities');
         }
     });
 }

 function getAmenitiesList(result, pageno) {
     var slno = ((9 * pageno) - 9);
     var tbody = document.getElementById("amenities_list");
     $("#amenities_list").empty();
     for (i = 0; i < result.length; i++) {
         var row = tbody.insertRow(i);
         var cell1 = row.insertCell(0);
         cell1.innerHTML = i + 1 + slno;
         var cell2 = row.insertCell(1);
         cell2.id = result[i]._id;
         cell2.innerHTML = result[i].name;
         var cell3 = row.insertCell(2);
         cell3.classList.add('upload_img');
         cell3.innerHTML = '<img alt="' + result[i].imageTag + '" src=/' + result[i].image + '>';
         //cell3.innerHTML = '<img src=' + image_url + result[i].image + '\>';
         var cell4 = row.insertCell(3);

         if (result[i].disableFlag == false) {
             cell4.classList.add('active_action')
             cell4.innerHTML = "<span>active</span>";
         } else {
             cell4.classList.add('disable_action')
             cell4.innerHTML = "<span>disable</span>";
         }
         var cell5 = row.insertCell(4);
         var url = "/admin/editamenities?id=" + encodeURIComponent(result[i]._id);
         var amenities_id = result[i]._id;
         var index = i;
         var editRecord = document.createElement('a');
         editRecord.title = "Edit";
         editRecord.style.color = "#3385ff";
         editRecord.href = url;
         var insideEdit = document.createElement('i');
         insideEdit.classList.add('fa', 'fa-pencil');
         insideEdit.setAttribute("aria-hidden", true);
         editRecord.appendChild(insideEdit);

         var deleteRecord = document.createElement('a');
         deleteRecord.style.color = "red";
         deleteRecord.title = "Delete";
         deleteRecord.onclick = (function(amenities_id, index) {
             return function() { deleteRecords(amenities_id, index); }
         })(amenities_id, index);
         var insideDelete = document.createElement('i');
         insideDelete.classList.add('fa', 'fa-trash-o');
         insideDelete.setAttribute("aria-hidden", true);
         deleteRecord.appendChild(insideDelete);

         var separator = document.createTextNode('|');
         cell5.appendChild(editRecord);
         cell5.appendChild(separator);
         cell5.appendChild(deleteRecord);
     }
 }



 function deleteRecords(amenities_id, index) {

     var r = confirm("Are you sure you want to disable?");
     if (r == true) {
         $.ajax({
             url: base_url + "/amenities/delete/" + amenities_id,
             type: "put",
             data: { "disableFlag": true },
             success: function(result) {
                 $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Disabled successfully</div>');
                 document.getElementById('amenities_list').deleteRow(index);
             },
             error: function(err) {
                 $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong>Could not Disable the Amenity</div>');
                 console.log('there was issue deleting the user ');
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
         if (currentpageno != pageno) { getAmenities(pageno, paginate); }
     });
     document.getElementById("nextpage").addEventListener("click", function(e) {
         console.log('nextpage');
         var currentpageno = $('#paginatebutton').find('.active').val();
         $('#paginatebutton li.active').next().addClass('active').siblings().removeClass('active');
         var pageno = $('#paginatebutton').find('.active').val();
         var paginate = false;
         if (currentpageno != pageno) { getAmenities(pageno, paginate); }
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
             getAmenities(pageno, paginate);
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
                 getAmenities(pageno, paginate);
             }
         })(pageno);
         paginate.appendChild(pagebutton);
     }
 }


 function searchAmenities() {
     var pageno = 1;
     var toSearch = document.getElementById('searchInputAmenity').value;
     $.ajax({
         url: "/amenities/custom/search?text=" + toSearch,
         type: "get",
         success: function(result) {
             var amenityrecords = result.amenity;
             getAmenitiesList(amenityrecords, pageno);
         },
         error: function(err) {
             console.log('there was issue fetching the amenities');
         }
     });
 }

 function clearAmenities() {
     var pageno = 1;
     var paginate = false;
     document.getElementById('searchInputAmenity').value = "";
     getAmenities(pageno, paginate);
 }