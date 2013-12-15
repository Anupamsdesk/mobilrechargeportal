//providers
var model = function(context){
	if (!context)
		throw Error("Invalid reference of context");
	this.find = function(){
		return context.find({});
	}
};

module.exports = model;