

var searchSession = function (config) {
	if (!config) {
		config = {};
	}
	this.name = config.name || "User";
	this.typeTable = {};
	this.searchArray = config.searchArray || new Array;
}

var SearchResult = function (config) {
	if (!config) {
		config = {};
	}
	this.name = config.name || "N/A";
	this.desc = config.desc || "N/A";
	this.date = config.date || "N/A";
	this.quantity = config.quantity || "N/A";
	this.firm = config.firm || "N/A";
	this.agency = config.agency || "N/A";
	this.recallNo = config.recallNo || "N/A";
	this.remedy = config.remedy || "N/A";
	this.img = config.img || "N/A";
	this.type = config.type || "N/A";

}


//Builds the shortened search results onto the main page
SearchResult.prototype.resultify = function (name, desc, date) {
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
// function buildSorted (obj) {
// 	for (var i=0; i<searchArray.length; i++) {
// 		if (searchArray[i]["date"] < obj["date"]) {
// 			searchArray.splice(i,0,obj);
// 			break;
// 		}
// 	}
// };

window.onload = function () {
	var fdaApiKey = "HHCcDGoruuTceo15i4wmqYRnRm6xztiRLY4FhS0F";
	$("#search-button").click(function(event) {
		$(".holder").remove();
		$.ajax({
	        url: 'http://www.saferproducts.gov/RestWebServices/Recall?RecallTitle=' + $("#search-box").val() + '&format=json',
	        method: "GET",
	        success: function (data) {
				for (var i=0; i < data.length; i++) {
					var currentSearch = new SearchResult();
					var retailers;
					var manufacturers;
					remedy();
					img();
					retail();
					manufacture();
					product();
					currentSearch.desc = data[i]["Description"];
					currentSearch.date = data[i]["RecallDate"].slice(0,10);
					currentSearch.date = parseInt(currentSearch.date.replace(/-/g,""));
					currentSearch.firm = retailers + ", " + manufacturers;
					currentSearch.agency = "Consumer Product Safety Commission (CPSC)"
					currentSearch.recallNo = data[i]["RecallID"];
					function remedy () {
						if (data[i]["Remedies"]) {
							currentSearch.remedy = data[i]["Remedies"][0]["Name"];	
						}
					};
					function img () {
						if (data[i]["Images"][0]) {
							currentSearch.img = data[i]["Images"][0]["URL"];
						} else {
							currentSearch.img = "img/teddy.png";
						}
					};
					function retail () {
						if (data[i]["Retailers"][0]) {
							retailers = data[i]["Retailers"][0]["Name"];
						} else {
							retailers = "";
						}
					};
					function manufacture () {
						if (data[i]["Manufacturers"][0]) {
							manufacturers = data[i]["Manufacturers"][0]["Name"];
						} else {
							manufacturers = "";
						}
					};
					function product () {
						if (data[i]["Products"][0]) {
							currentSearch.name = data[i]["Products"][0]["Name"];
							currentSearch.quantity = data[i]["Products"][0]["NumberOfUnits"];
							currentSearch.type = data[i]["Products"][0]["Type"];	
						}
					};
	  				
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
				for (var i=0; i < data["results"].length; i++) {
					var currentSearch = new SearchResult();
					currentSearch.name = data["results"][i]["product_description"];
					currentSearch.desc = data["results"][i]["reason_for_recall"];
					currentSearch.date = parseInt(data["results"][i]["recall_initiation_date"]);
					currentSearch.quantity = data["results"][i]["product_quantity"];
					currentSearch.firm = data["results"][i]["recalling_firm"];
					currentSearch.agency = "Federal and Drug Administration (FDA)";
					currentSearch.type = data["results"][i]["product_type"];
					currentSearch.recallNo = data["results"][i]["recall_number"];
					currentSearch.remedy = "http://www.fda.gov/Safety/Recalls/default.htm";
					currentSearch.img = "img/food.png";

	        	}
	        },
	        error: function(error) {
	          console.log ('FDA server is not responding');
	        }
		});
		event.preventDefault();
	});
}

