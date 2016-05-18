

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
SearchResult.prototype.resultify = function () {
	var holderDiv = $("<div>").attr({class:"row card-panel hoverable holder"});
	var imgDiv = $("<div>").attr({class:"col m2 valign-wrapper"});
	var img = $("<img>").attr({src:this.img, alt:this.type, class: "responsive-img valign"});
	imgDiv.append(img);
	var textDiv = $("<div>").attr({class:"col m8"});
	if (this.name.length > 100) {
		var shortName = this.name.slice(0,100) + "...";
	};
	var headingText = $("<p>").attr({class:"heading-text"}).html(shortName);
	if (this.desc.length > 200) {
		var shortDesc = this.desc.slice(0,200) + "...";
	};
	this.date = this.date.toString();
	this.date = this.date.slice(4,6) + "/" + this.date.slice(6) + "/" + this.date.slice(0,4);
	var dateText = $("<p>").attr({class:"date-result"}).html(this.date);
	var descText = $("<p>").html(shortDesc);

	var buttonDiv = $("<div>").attr({class:"col m2"});
	var moreButton = $("<button>").attr({class:"btn waves-effect waves-light right more-button modal-trigger ", "data-target":"detail-modal" }).html("more");
	moreButton.leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 400, // Transition in duration
      out_duration: 300, // Transition out duration
    });
	moreButton.click((function () {
		$('.modal-name').html(this.name);
		$('.modal-date').html(this.date);
		$('.modal-firm').html(this.firm);
		$('.modal-quant').html(this.quantity);
		$('.modal-agency').html(this.agency);
		$('.modal-recall').html(this.recallNo);
		$('.modal-desc').html(this.desc);
		$('.modal-remedy').html(this.remedy);
		$('.modal-img').attr("src",this.img);
	}).bind(this));

	buttonDiv.append(moreButton);
	holderDiv.append(imgDiv);
	textDiv.append(headingText);
	textDiv.append(dateText);
	textDiv.append(descText);
	holderDiv.append(textDiv);
	holderDiv.append(buttonDiv);
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
	$('#detail-modal').leanModal();
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
						if (data[i]["Remedies"].length > 0) {
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
					currentSearch.resultify();
	        	}
	        },
	        error: function(error) {
	          console.log ('CSPC server is not responding');
	        }        
      	});
		$.ajax({
	        url: 'https://api.fda.gov/food/enforcement.json?api_key=' + fdaApiKey + '&search=' + $("#search-box").val() + '&limit=10',
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
					currentSearch.resultify();
	        	}
	        	
	        },
	        error: function(error) {
	          console.log ('FDA server is not responding');
	        }
		});
		event.preventDefault();
	});
}

