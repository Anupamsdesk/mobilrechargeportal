//Mongodb
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;
var Q =require("q");

var DBService = function (hostname,port,dbname){
	this.hostname = "mongodb://dbuser:dbpass123#@ds061318.mongolab.com:61318/mydb";
	this.port = port;
	this.dbname = dbname;
	this.mongocli = MongoClient;
		//new MongoClient(new Server(hostname,port,{native_parser: true}));		
	
	this.checkConfigSanity = function(){
		if (!this.mongocli){
			throw "Error: Invalid reference to Mongo Client ";
		}else if (!this.dbname){
			throw "Error: Invalid reference to Database ";
		}				
	}
	this.Collection = Collection;
	//this.checkConfigSanity();
};

var Collection = function (name){	
	this.name = name;
	this.checkConfigSanity();
	var me = this;	
	this.Close = function(){
		if (this.mongocli.db){
			this.mongocli.db.close();
		}			
	};
	
	this.Add = function(){
		var deferred = Q.defer();
		this.mongocli.connect(this.hostname,function (err, db){
			var client = db;
			if (err) deferred.reject(err);			
			db.createCollection(me.name, function(err,data){
				if (err){					
					if (client)
						client.close();
					deferred.reject(new Error("Error: "+err));
				}
				else {
					client.close();
					deferred.resolve(data);
				}
			});
		});
		return deferred.promise;
	};

	this.Remove= function(){
		var deferred = Q.defer();
		this.mongocli.connect(this.hostname,function (err, db){

			if (err) deferred.reject(err);
			var client = db;
			db.dropCollection(me.name, function(err,data){

				if (err){					
					if (client)
						client.close();
					
					deferred.reject(new Error("Error: "+err));
					
				}
				else {
					client.close();
					deferred.resolve(data);
				}
			});
		});
		return deferred.promise;
	};

	this.Insert = function(obj){
		var deferred = Q.defer();
		this.mongocli.connect(this.hostname,function (err, db){
			if (err) deferred.reject(err);
			var client = db;
			db.collection(me.name).insert(obj, function(err,data){
				if (err){					
					if (client) client.close();					
					deferred.reject(new Error("Error: "+err));					
				}
				else {
					client.close();
					deferred.resolve(data);
				}
			});
		});
		return deferred.promise;
	};

	this.Find = function(query, projection){
		if (!query)
			query ={};
		if (!projection)
			projection={};
		var deferred = Q.defer();
		this.mongocli.connect(this.hostname, function (err, db){			
			if (err) deferred.reject(err);
			var client = db;			
			var list = [];
			console.log(query);
			db.collection(me.name).find(query,projection).each(function(err,data){
				if (err){
					if (client) client.close();					
					deferred.reject(new Error("Error: "+err));					
				}
				if (data==null){
					client.close();
					deferred.resolve(list);
				}else
					list.push(data);
			});			
		});
		return deferred.promise;
	};

	this.Update = function(id, object){
		var deferred = Q.defer();
		if (!id || !object){
			deferred.reject(new Error("Error: Invalid Reference"));		
		}


		this.mongocli.connect(this.hostname, function (err, db){
			if (err) deferred.reject(err);
			var client = db;			
			var list = [];
			db.collection(me.name).update({"_id" : new ObjectID(id)}, object, function(err,data){
				if (err){
					if (client) client.close();					
					deferred.reject(new Error("Error: "+err));					
				}
				deferred.resolve(data);
				client.close();
			});
		});
		return deferred.promise;
	};
	this.Delete = function(id){
		var deferred = Q.defer();
		if (!id){
			deferred.reject(new Error("Error: Invalid Reference"));		
		}
		this.mongocli.connect(this.hostname, function (err, db){
			if (err) deferred.reject(err);
			var client = db;
			var list = [];
			db.collection(me.name).remove({"_id" : new ObjectID(id)}, function(err,data){
				if (err){
					if (client) client.close();					
					deferred.reject(new Error("Error: "+err));					
				}
				deferred.resolve(data);
				client.close();
			});
		});
		return deferred.promise;
	};
	return this;
};

module.exports = DBService;