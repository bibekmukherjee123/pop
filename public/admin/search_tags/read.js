  var base_url = "";
  //var base_url = "http://localhost:1234"

  $(document).ready(function() {
      $('.i-checks').iCheck({
          checkboxClass: 'icheckbox_square-green',
          radioClass: 'iradio_square-green',
      });
      var pageno = 1;
      var paginate = true;
      getTagRecords(pageno, paginate);
  });

  function getTagRecords(pageno, paginate) {
      $.ajax({
          url: "/searchtags/read?pagenumber=" + pageno,
          type: "get",
          success: function(result) {
              var tagrecords = result.tags;
              var totalPages = result.totalpages;
              getTagsList(tagrecords, pageno);
              if (paginate == true) { createPagination(totalPages); }
          },
          error: function(err) {
              console.log('there was issue fetching the Tags');
          }
      });
  }

  function getTagsList(result, pageno) {
      var slno = ((9 * pageno) - 9);
      var tbody = document.getElementById("search_tags_list");
      $("#search_tags_list").empty();
      for (i = 0; i < result.length; i++) {
          var row = tbody.insertRow(i);
          var cell1 = row.insertCell(0);
          cell1.innerHTML = i + 1 + slno;
          var cell2 = row.insertCell(1);
          cell2.id = result[i]._id;
          cell2.innerHTML = result[i].name;
          var cell3 = row.insertCell(2);
          if (result[i].disableFlag == false) {
              cell3.classList.add('active_action')
              cell3.innerHTML = "<span>active</span>";
          } else {
              cell3.classList.add('disable_action')
              cell3.innerHTML = "<span>disable</span>";
          }
          var cell4 = row.insertCell(3);
          var url = "tag_search.html?id=" + encodeURIComponent(result[i]._id);
          var tags_id = result[i]._id;
          localStorage.setItem('tagkey', tags_id);
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
          deleteRecord.onclick = (function(tags_id, index) {
              return function() { deleteRecords(tags_id, index); }
          })(tags_id, index);
          var insideDelete = document.createElement('i');
          insideDelete.classList.add('fa', 'fa-trash-o');
          insideDelete.setAttribute("aria-hidden", true);
          deleteRecord.appendChild(insideDelete);

          var separator = document.createTextNode('|');
          cell4.appendChild(editRecord);
          cell4.appendChild(separator);
          cell4.appendChild(deleteRecord);
      }

  }

  function deleteRecords(tags_id, index) {

      var r = confirm("Are you sure you want to delete?");
      if (r == true) {
          $.ajax({
              url: base_url + "/searchtags/delete/" + tags_id,
              type: "put",
              data: { "disableFlag": true },
              success: function(result) {
                  $("#alert_placeholder").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong>Deleted successfully</div>');
                  document.getElementById('search_tags_list').deleteRow(index);
              },
              error: function(err) {
                  $("#alert_placeholder").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong>Could not Delete the Tags</div>');
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
          if (currentpageno != pageno) { getTagRecords(pageno, paginate); }
      });
      document.getElementById("nextpage").addEventListener("click", function(e) {
          console.log('nextpage');
          var currentpageno = $('#paginatebutton').find('.active').val();
          $('#paginatebutton li.active').next().addClass('active').siblings().removeClass('active');
          var pageno = $('#paginatebutton').find('.active').val();
          var paginate = false;
          if (currentpageno != pageno) { getTagRecords(pageno, paginate); }
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
              getTagRecords(pageno, paginate);
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
                  getTagRecords(pageno, paginate);
              }
          })(pageno);
          paginate.appendChild(pagebutton);
      }
  }

  function searchTagList() {
      var pageno = 1;
      var toSearch = document.getElementById('searchInputTags').value;
      $.ajax({
          url: "/searchtags/custom/search?text=" + toSearch,
          type: "get",
          success: function(result) {
              var tagrecords = result.tags;
              getTagsList(tagrecords, pageno);
          },
          error: function(err) {
              console.log('there was issue fetching the amenities');
          }
      });
  }

  function clearTagList() {
      var pageno = 1;
      var paginate = false;
      document.getElementById('searchInputTags').value = "";
      getTagRecords(pageno, paginate);
  }