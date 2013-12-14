//phone nos
var Model = require("../DTOs");

var model = function(context){
	if (!context)
		throw Error("Invalid reference of context");


	this.findForUser = function(userid){
		return context.find({UserId : userid});
	}


	this.create = function (obj, userid){
		obj.UserId=userid;
		obj.Balance=0.0;
		obj.Group=[];
		AssureIsValid(obj);		
		//computeId(obj);
		return context.add(obj);
	};

	function AssureIsValid(obj){
		if (!obj.Number || !obj.UserId ){
			throw Error("Number and User Id required");
		}
	}
	function computeId(obj){
		obj.Id = obj.UserId+":::"+obj.Number;
	}

	function AssureHasId(obj){
		if (!obj._id){
			throw Error("_id is required!");
		}

	}
}
module.exports = model;