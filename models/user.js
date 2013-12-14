//user.js
var Model = require("../DTOs");
var bcrypt = require('bcrypt-nodejs');

var model = function (context){

	if (!context)
		throw Error("Invalid reference of context");

	this.list = function(){
		return context.list();
	};

	this.findByEmail = function(email){
		return context.find({Email: email},{});
	}
	this.validateUser = function(email, password, cb){		
		context.find({Email:email},{}).then(function(obj){
			if (obj.length === 0){
				cb(false);
			}
			else{
				var val = (obj[0].Password === password);
				console.log ("status: "+ val);
				cb(val,obj[0]);	
			}
		});
	}


	this.create = function (obj){
		AssureIsValid(obj);		
		// Generate password hash
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(obj.password, salt);
	 	//obj.Password = password_hash;
		return context.add(obj);
	};

	this.delete = function (obj){
		AssureHasId(obj);
		return context.delete(obj._id);
	};

	this.update = function(obj){
		AssureHasId(obj);
		AssureIsValid(obj);

		var id = obj._id;
		delete obj._id;
		return context.update(id, obj);
	}
};
function AssureIsValid(obj){
	if (!obj.FirstName || !obj.LastName || !obj.Password || !obj.Email ){
			throw Error("FirstName, LastName, Password and Email is required!");
	}
}
function AssureHasId(obj){
	if (!obj._id){
		throw Error("_id is required!");
	}

}

module.exports = model;