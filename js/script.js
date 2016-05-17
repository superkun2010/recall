

var searchArray = new Array;

//Builds the shortened search results onto the main page
function resultify (name, desc, date) {
	var holderDiv = $("<div>").attr({class:"row holder"});
	var dateDiv = $("<div>").attr({class:"col-md-offset-1 col-md-2 date-result"});
	dateDiv.html(date);
	var textDiv = $("<div>").attr({class:"col-md-6"});
	if (name.length > 100) {
		name = name.slice(0,100) + "...";
	};
	var headingText = $("<h3>").html(name);
	if (desc.length > 200) {
		desc = desc.slice(0,200) + "...";
	};
	var descText = $("<p>").html(desc);
	var imgDiv = $("<div>").attr({class:"col-md-2 img-result"});
	holderDiv.append(dateDiv);
	textDiv.append(headingText);
	textDiv.append(descText);
	holderDiv.append(textDiv);
	holderDiv.append(imgDiv);
	$(".container").append(holderDiv);

};

//Builds a sorted Array of objects
//to build test
function buildSorted (obj) {
	for (var i=0; i<searchArray.length; i++) {
		if (searchArray[i]["date"] < obj["date"]) {
			searchArray.splice(i,0,obj);
			break;
		}
	}
};

window.onload = function () {
	var fdaApiKey = "HHCcDGoruuTceo15i4wmqYRnRm6xztiRLY4FhS0F";
	$("#search-button").click(function(event) {
		$(".holder").remove();
		$.ajax({
	        url: 'http://www.saferproducts.gov/RestWebServices/Recall?RecallTitle=' + $("#search-box").val() + '&format=json',
	        method: "GET",
	        success: function (data) {
				for (var i=0; data.length; i++) {
					var recallName = data[i]["Products"][0]["Name"];
					var recallDesc = data[i]["Title"];
					var recallDate = data[i]["RecallDate"].slice(0,10);
					recallDate = parseInt(recallDate.replace(/-/g,""));
					resultify(recallName, recallDesc, recallDate);
					

					// var recallObj = {name: recallName, desc: recallDesc, date: recallDate};
					// buildSorted(recallObj);
	        	}
	        },
	        error: function(error) {
	          console.log ('CSPC server is not responding');
	        }        
      	});
		$.ajax({
	        url: 'https://api.fda.gov/food/enforcement.json?search=' + $("#search-box").val() + '&limit=10',
	        method: "GET",
	        success: function (data) {
				for (var i=0; data["results"].length; i++) {
					var recallName = data["results"][i]["product_description"];
					var recallDesc = data["results"][i]["reason_for_recall"];
					var recallDate = parseInt(data["results"][i]["recall_initiation_date"]);
					resultify(recallName, recallDesc, recallDate);
					// var recallObj = {name: recallName, desc: recallDesc, date: recallDate};
					// buildSorted(recallObj);
	        	}
	        },
	        error: function(error) {
	          console.log ('FDA server is not responding');
	        }
		});
		event.preventDefault();
	});
}

