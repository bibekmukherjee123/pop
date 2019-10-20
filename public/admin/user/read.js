 var base_url = "";
 //var base_url = "http://localhost:1234"
 $(document).ready(function() {
     $('.i-checks').iCheck({
         checkboxClass: 'icheckbox_square-green',
         radioClass: 'iradio_square-green',
     });
     var pageno = 1;
     var paginate = true;
     getUserValues(pageno, paginate);
 });

 function getUserValues(pageno, paginate) {
     $.ajax({
         url: "/users/read?pagenumber=" + pageno,
         type: "get",
         success: function(result) {
             var userlist = result.userlist;
             var totalPages = result.totalpages;
             getUsersList(userlist, pageno);
             if (paginate == true) { createPagination(totalPages); }
         },
         error: function(err) {
             console.log('there was issue fetching the Users');
         }
     });
 }

 function getUsersList(result, pageno) {
     var slno = ((9 * pageno) - 9);
     var tbody = document.getElementById("users_list");
     $("#users_list").empty();
     for (i = 0; i < result.length; i++) {
         var row = tbody.insertRow(i);
         var cell1 = row.insertCell(0);
         cell1.innerHTML = i + 1 + slno;
         var cell2 = row.insertCell(1);
         cell2.id = result[i]._id;
         cell2.innerHTML = result[i].username;
         var cell3 = row.insertCell(2);
         cell3.innerHTML = result[i].email;
         var cell4 = row.insertCell(3);
         if (result.mobile != null) {
             cell4.innerHTML = result[i].mobile;
         } else {
             cell4.innerHTML = "";
         }
         var cell5 = row.insertCell(4);
         cell5.classList.add('upload_img');
         cell5.innerHTML = '<img style="width:30px" alt="user" src="/' + result[i].image + '">';
         var cell6 = row.insertCell(5);
         if (result[i].disableFlag == false) {
             cell6.classList.add('active_action')
             cell6.innerHTML = "<span>active</span>";
         } else {
             cell6.classList.add('disable_action')
             cell6.innerHTML = "<span>disable</span>";
         }
         var user_id = result[i]._id;
         var index = i;
         var cell7 = row.insertCell(6);
         var url = "/admin/editusers?id=" + encodeURIComponent(result[i]._id);

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
         deleteRecord.onclick = (function(user_id, index) {
             return function() { deleteUser(user_id, index); }
         })(user_id, index);
         var insideDelete = document.createElement('i');
         insideDelete.classList.add('fa', 'fa-trash-o');
         insideDelete.setAttribute("aria-hidden", true);
         deleteRecord.appendChild(insideDelete);

         var separator = document.createTextNode('|');
         cell7.appendChild(editRecord);
         cell7.appendChild(separator);
         cell7.appendChild(deleteRecord);
     }
 }

 function deleteUser(user_id, index) {
     console.log('here in admin');
     var r = confirm("Are you sure?");
     if (r == true) {
         $.ajax({
             url: base_url + "/users/delete/" + user_id,
             type: "put",
             data: { "disableFlag": true },
             success: function(result) {
                 $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Disabled successfully</div>');
                 document.getElementById('users_list').deleteRow(index);
             },
             error: function(err) {
                 $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong>Could not Disabled the User</div>');
                 console.log('there was issue disabling the user ');
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
         if (currentpageno != pageno) { getUserValues(pageno, paginate); }
     });
     document.getElementById("nextpage").addEventListener("click", function(e) {
         console.log('nextpage');
         var currentpageno = $('#paginatebutton').find('.active').val();
         $('#paginatebutton li.active').next().addClass('active').siblings().removeClass('active');
         var pageno = $('#paginatebutton').find('.active').val();
         var paginate = false;
         if (currentpageno != pageno) { getUserValues(pageno, paginate); }
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
             getUserValues(pageno, paginate);
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
                 getUserValues(pageno, paginate);
             }
         })(pageno);
         paginate.appendChild(pagebutton);
     }
 }

 function searchUsers() {
     var pageno = 1;
     var toSearch = document.getElementById('searchInputUsers').value;
     $.ajax({
         url: "/users/custom/search?text=" + toSearch,
         type: "get",
         success: function(result) {
             var userlist = result.userlist;
             getUsersList(userlist, pageno);
         },
         error: function(err) {
             console.log('there was issue fetching the amenities');
         }
     });
 }

 function clearUsers() {
     var pageno = 1;
     var paginate = false;
     document.getElementById('searchInputUsers').value = "";
     getUserValues(pageno, paginate);
 }