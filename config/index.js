//index.js
//Stores the dependencies and configuration
var Service = require("../lib/mongo");
var Context = require("../lib/context");
var UserModel = require("../models/user");
var PhoneModel = require("../models/phone");
var ProviderModel = require("../models/provider");
var TransactionModel = require("../models/transaction");

var dbConfig = {
	host: "localhost"
	, port: "27063"
	, db: "mydb"
	, userCollection: "users"
	, phoneCollection: "phones"
	, providerCollection: "providers"
	, transactionCollection: "transactions"
};
var dbService = new Service (dbConfig.host, dbConfig.port, dbConfig.db);
var userContext = new Context(dbService, dbConfig.userCollection);
var userModel = new UserModel(userContext);
var provContext = new Context(dbService,dbConfig.providerCollection);
var providerModel = new ProviderModel(provContext);

var phoneModel = new PhoneModel(new Context(dbService,dbConfig.phoneCollection));
var transModel = new TransactionModel(new Context(dbService,dbConfig.transactionCollection));

module.exports = {
	  dbConfig:  dbConfig
	, dbService: Service
	, dbContext: Context
	, userModel: userModel
	, phoneModel: phoneModel
	, providerModel: providerModel
	, transactionModel: transModel
};