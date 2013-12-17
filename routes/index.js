
/*
 * GET home page.
 */
var userApi = require("./users");
var phoneNumbersApi = require("./phones");

var ConfigureRoutes = function (app, config){		
	var providers = config.providerModel;
	var transactions = config.transactionModel;
	
	//index file
	app.get('/', function(req, res) {  
    	res.render('index.html');
	});	
	
	//Register User Api
	userApi(app,config);

	//Register Phone Api
	phoneNumbersApi(app,config);
	
	//include provider Api
	app.get("/provider", function(req,res){
		providers.find().then(function(data){
			res.send({"status":"success", "data": data});
		}, function(eer){
	    res.send({"status":"failure"});
	  });	
	});  	
};
function errorHandler(err,req,res){
	console.log(err);
	res.send({"status": "error", "msg": err});
}

module.exports = ConfigureRoutes;