//transaction.js
var model = function(context){
	if (!context)
		throw Error("Invalid reference of context");
	
	this.insert = function(uid,number,balance,provider,country,area){
		var dt = new Date();
		var obj = {
			'UserId': uid,
			'Number': number,
			'Balance': balance,
			'Provider': provider,
			'Country': country,
			'Area': area,
			'Timestamp': dt.toString()
		};
		return context.add(obj);
	};

};

module.exports = model;