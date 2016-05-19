

var SearchUser = function (config) {
	if (!config) {
		config = {};
	}
	this.name = config.name || "User";
	this.typeTable = {};
	this.searchArray = config.searchArray || new Array;
	this.searchStorage = config.searchStorage || new Array;
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
function resultify (obj) {
	for (var i = 0; i < obj.length; i++) {	
		var holderDiv = $("<div>").attr({class:"row card-panel hoverable holder"});
		var imgDiv = $("<div>").attr({class:"col m2 valign-wrapper"});
		var img = $("<img>").attr({src:obj[i].img, alt:obj[i].type, class: "responsive-img valign"});
		imgDiv.append(img);
		var textDiv = $("<div>").attr({class:"col m8"});
		if (obj[i].name.length > 100) {
			var shortName = obj[i].name.slice(0,100) + "...";
		} else {
			var shortName = obj[i].name;
		}
		var headingText = $("<p>").attr({class:"heading-text"}).html(shortName);
		if (obj[i].desc.length > 200) {
			var shortDesc = obj[i].desc.slice(0,200) + "...";
		} else {
			var shortDesc = obj[i].desc;
		}
		obj[i].date = obj[i].date.toString();
		obj[i].date = obj[i].date.slice(4,6) + "/" + obj[i].date.slice(6) + "/" + obj[i].date.slice(0,4);
		var dateText = $("<p>").attr({class:"date-result"}).html(obj[i].date);
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
		}).bind(obj[i]));

		buttonDiv.append(moreButton);
		holderDiv.append(imgDiv);
		textDiv.append(headingText);
		textDiv.append(dateText);
		textDiv.append(descText);
		holderDiv.append(textDiv);
		holderDiv.append(buttonDiv);
		$(".container").append(holderDiv);
	}

};

//launches a new user 
var newUser = new SearchUser();

// Builds a sorted array of search results by date and puts them in the user search array
function buildSorted (obj) {

	if (newUser.searchArray.length === 0) {
		newUser.searchArray.push(obj);
		return;
	}
	for (var i=0; i<newUser.searchArray.length; i++) {
		if (newUser.searchArray[i]["date"] < obj["date"]) {
			newUser.searchArray.splice(i,0,obj);
			return;
		} else if (i === newUser.searchArray.length-1) {
			newUser.searchArray.push(obj);
			return;
		}
	}
};

window.onload = function () {
	 var fdaApiKey = "HHCcDGoruuTceo15i4wmqYRnRm6xztiRLY4FhS0F";
	//on click of the search button all ajax requests will be executed
	$("#search-button").click(function(event) {
		$(".holder").remove();

		//ajax request sent to CPSC
		var cpscPromise = $.ajax({
	        url: 'http://www.saferproducts.gov/RestWebServices/Recall?RecallTitle=' + $("#search-box").val() + '&format=json',
	        method: "GET"     
      	});

		//request sent out to the FDA which retrieves ENFORCEMENT REPORTS not recalls
      	var fdaPromise = $.ajax({
		    url: 'https://api.fda.gov/food/enforcement.json?api_key=' + fdaApiKey + '&search=' + $("#search-box").val() + '&limit=10',
	        method: "GET"
	    });

	    $.when(cpscPromise, fdaPromise).done(function(cpscResponse, fdaResponse) {
	    	console.log(cpscResponse, fdaResponse);
			//formatting CPSC data
			if (cpscResponse[1] == "success"){
				for (var i=0; i < cpscResponse[0].length; i++) {
					var currentSearch = new SearchResult();
					var retailers;
					var manufacturers;
					remedy();
					img();
					retail();
					manufacture();
					product();
					currentSearch.desc = cpscResponse[0][i]["Description"];
					currentSearch.date = cpscResponse[0][i]["RecallDate"].slice(0,10);
					currentSearch.date = parseInt(currentSearch.date.replace(/-/g,""));
					currentSearch.firm = retailers + ", " + manufacturers;
					currentSearch.agency = "Consumer Product Safety Commission (CPSC)"
					currentSearch.recallNo = cpscResponse[0][i]["RecallID"];
					function remedy () {
						if (cpscResponse[0][i]["Remedies"].length > 0) {
							currentSearch.remedy = cpscResponse[0][i]["Remedies"][0]["Name"];	
						}
					};
					function img () {
						if (cpscResponse[0][i]["Images"][0]) {
							currentSearch.img = cpscResponse[0][i]["Images"][0]["URL"];
						} else {
							currentSearch.img = "img/teddy.png";
						}
					};
					function retail () {
						if (cpscResponse[0][i]["Retailers"][0]) {
							retailers = cpscResponse[0][i]["Retailers"][0]["Name"];
						} else {
							retailers = "";
						}
					};
					function manufacture () {
						if (cpscResponse[0][i]["Manufacturers"][0]) {
							manufacturers = cpscResponse[0][i]["Manufacturers"][0]["Name"];
						} else {
							manufacturers = "";
						}
					};
					function product () {
						if (cpscResponse[0][i]["Products"][0]) {
							currentSearch.name = cpscResponse[0][i]["Products"][0]["Name"];
							currentSearch.quantity = cpscResponse[0][i]["Products"][0]["NumberOfUnits"];
							currentSearch.type = cpscResponse[0][i]["Products"][0]["Type"];	
						}
					};
					buildSorted(currentSearch);
				}
			} else {
				console.log("CSPC server is not responding");
			}
			//formatting FDA data
			if (fdaResponse[1] == "success") {
				for (var i=0; i < fdaResponse[0]["results"].length; i++) {
							var currentSearch = new SearchResult();
							currentSearch.name = fdaResponse[0]["results"][i]["product_description"];
							currentSearch.desc = fdaResponse[0]["results"][i]["reason_for_recall"];
							currentSearch.date = parseInt(fdaResponse[0]["results"][i]["recall_initiation_date"]);
							currentSearch.quantity = fdaResponse[0]["results"][i]["product_quantity"];
							currentSearch.firm = fdaResponse[0]["results"][i]["recalling_firm"];
							currentSearch.agency = "Federal and Drug Administration (FDA)";
							currentSearch.type = fdaResponse[0]["results"][i]["product_type"];
							currentSearch.recallNo = fdaResponse[0]["results"][i]["recall_number"];
							currentSearch.remedy = "http://www.fda.gov/Safety/Recalls/default.htm";
							currentSearch.img = "img/food.png";
							buildSorted(currentSearch);
				}
			} else {
				console.log ('FDA server is not responding');
			}
			//rendering all responses to the page
			resultify(newUser.searchArray);

	    });
		event.preventDefault();
	});
}

