//Models
var DTOs = {};

DTOs.User = function (){
	this.FirstName = "",
	this.LastName="",
	this.Password="",
	this.Email="",
	this.Phone=null,
	this.Id=null,
	this.LastLogin=null,
	this.CreatedOn=Date(),
	this.Type=null,
	this.Role=null

};
DTOs.Phone = function(){	
	this.Number = "";
	this.UserId = "";
	this.Groups = [];
	this.Balance = 0.0;
};

//DTOs.Roles = ["User", "Manager", "Admin", "SuperAdmin"];


module.exports = DTOs;