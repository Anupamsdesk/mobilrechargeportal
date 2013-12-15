//phone nos
var Model = require("../DTOs");

var model = function(context){
	if (!context)
		throw Error("Invalid reference of context");


	this.findForUser = function(userid){
		return context.find({UserId : userid});
	}

	this.findNumberAndUser = function(userid, number){
		return context.find({UserId: userid, Number: number});
	}


	this.updateBalance = function(userid, number, amount, cb){
		context.close();
		this.findNumberAndUser(userid, number).then(function(obj){
			context.close();
			obj[0].Balance = obj[0].Balance + (+amount);
			console.dir(obj[0]);
			var id = obj[0]._id.toString();
			delete(obj[0]._id);
			console.dir(obj[0]);
			context.update(id, obj[0]).then(function(d){
				cb(true);
			}, function(e){ cb(false);})
		}, function(x){
			cb(false);
		});
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