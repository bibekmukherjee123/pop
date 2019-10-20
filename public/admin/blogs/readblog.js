 var base_url = "";
 //var base_url = "http://localhost:1234"
 $(document).ready(function() {
     $('.i-checks').iCheck({
         checkboxClass: 'icheckbox_square-green',
         radioClass: 'iradio_square-green',
     });
     var pageno = 1;
     var paginate = true;
     getBlogValues(pageno, paginate);
 });

 function getBlogValues(pageno, paginate) {
     $.ajax({
         url: "/blog/read?pagenumber=" + pageno,
         type: "get",
         success: function(result) {
             var blogrecords = result.blogs;
             var totalPages = result.totalpages;
             getBlogList(blogrecords, pageno);
             if (paginate == true) { createPagination(totalPages); }
         },
         error: function(err) {
             console.log('there was issue fetching the blogs');
         }
     });
 }

 function getBlogList(result, pageno) {
     var slno = ((9 * pageno) - 9);
     var tbody = document.getElementById("blog_list");
     $("#blog_list").empty();
     for (i = 0; i < result.length; i++) {
         var row = tbody.insertRow(i);
         var cell1 = row.insertCell(0);
         cell1.innerHTML = i + 1 + slno;
         var cell2 = row.insertCell(1);
         cell2.id = result[i]._id;
         cell2.innerHTML = result[i].title;
         var cell3 = row.insertCell(2);
         cell3.innerHTML = result[i].shortDescription;
         var cell4 = row.insertCell(3);
         var temp = new Date(result[i].createdDate);
         cell4.innerHTML = temp.getDate() + '/' + (temp.getMonth() + 1) + '/' + temp.getFullYear();
         var cell5 = row.insertCell(4);
         cell5.classList.add('upload_img');
         cell5.innerHTML = '<img style="width:30px;" src="' + base_url + '/' + result[i].image + '">';
         var cell6 = row.insertCell(5);
         var url = "/admin/editblog?id=" + encodeURIComponent(result[i]._id);
         var blog_id = result[i]._id;
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
         deleteRecord.onclick = (function(blog_id, index) {
             return function() { deleteRecords(blog_id, index); }
         })(blog_id, index);
         var insideDelete = document.createElement('i');
         insideDelete.classList.add('fa', 'fa-trash-o');
         insideDelete.setAttribute("aria-hidden", true);
         deleteRecord.appendChild(insideDelete);

         var separator = document.createTextNode('|');
         cell6.appendChild(editRecord);
         cell6.appendChild(separator);
         cell6.appendChild(deleteRecord);
     }

 }

 function deleteRecords(blog_id, index) {

     var r = confirm("Are you sure you want to delete?");
     if (r == true) {
         $.ajax({
             url: base_url + "/blog/delete/" + blog_id,
             type: "delete",
             success: function(result) {
                 $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Deleted successfully</div>');
                 document.getElementById('blog_list').deleteRow(index);
             },
             error: function(err) {
                 $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong>Could not Delete the Blog</div>');
                 console.log('there was issue deleting the tags ');
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
         if (currentpageno != pageno) { getBlogValues(pageno, paginate); }
     });
     document.getElementById("nextpage").addEventListener("click", function(e) {
         console.log('nextpage');
         var currentpageno = $('#paginatebutton').find('.active').val();
         $('#paginatebutton li.active').next().addClass('active').siblings().removeClass('active');
         var pageno = $('#paginatebutton').find('.active').val();
         var paginate = false;
         if (currentpageno != pageno) { getBlogValues(pageno, paginate); }
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
             getBlogValues(pageno, paginate);
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
                 getBlogValues(pageno, paginate);
             }
         })(pageno);
         paginate.appendChild(pagebutton);
     }
 }