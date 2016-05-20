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

SearchUser.prototype.newSearch = function () {
	if (this.searchArray.length !== 0) {
		this.searchStorage.push(this.searchArray);
		this.searchArray = [];
		$(".holder").remove();
	}
}