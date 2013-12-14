//index.js
//Stores the dependencies and configuration
var Service = require("../lib/mongo");
var Context = require("../lib/context");
var UserModel = require("../models/user");
var PhoneModel = require("../models/phone");

var dbConfig = {
	host: "localhost"
	, port: "27063"
	, db: "mydb"
	, userCollection: "users"
	, phoneCollection: "phones"
};


var dbService = new Service (dbConfig.host,dbConfig.port,dbConfig.db);
//var usrs = dbService.Collection("users);
//usrs.Find();

var userContext = new Context(dbService,dbConfig.userCollection);
//console.dir(Context.list());
var userModel = new UserModel(userContext);
var phoneModel = new PhoneModel(new Context(dbService,dbConfig.phoneCollection));
module.exports = {
	  dbConfig:  dbConfig
	, dbService: Service
	, dbContext: Context
	, userModel: userModel
	, phoneModel: phoneModel
};