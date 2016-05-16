
console.log($());


window.onload = function () {
	$("#search-button").click(function() {
		$.ajax({
        url: 'http://www.saferproducts.gov/RestWebServices/Recall?Title=Child&RecallDescription=metal&format=json',
        method: "GET",
        success: function (data) {
        	for (var i=0; i<data.length; i++) {
        		if (data[i]["Title"]) {
        			var searchLCase = data[i]["Title"].toLowerCase();
	        		if (searchLCase.indexOf($("#search-box").val().toLowerCase()) !== -1) {
	        			var searchResult = $('<div>').html(data[i]["Title"]);
	        			searchResult.appendTo($('#search-results'));
	        		}
        		}
        	}
        },
        error: function(error) {
          console.log ('CSPC server is not responding');
        }
      });
	});

	

}

// $("#submit-button").click(function(event){
// 	var complete = $('<input>').attr({type:"checkbox"});
// 	var addItem = $('<li>').html($("#add-item").val());
// 	var removeButton = $('<button>').attr({
// 		"class":"btn btn-warning",
// 		"name":"remove"
// 	}).html("remove");
// 	$("#list-col").append(addItem);
// 	$("#list-col li:last-child").prepend(complete);
// 	$("#list-col li:last-child input").click(function (event) {
// 	if (event.target.checked) {
// 		$(event.target).addClass("completed");
// 		$(event.target).parent().css("text-decoration","line-through");
// 	} else {
// 		$(event.target).removeClass("completed");
// 		$(event.target).parent().css("text-decoration","none");
// 	}
// });
// 	$("#list-col li:last-child").append(removeButton);
// 	$("#list-col li:last-child button").click(function (event) {
// 		$(event.target).parent().remove();
// 	})
// 	event.preventDefault();
// 	$("#add-item").val("");
// })

