/**
	A Generic Context for CRUD operations with an generic docs.
	Derive from it to enable more specific context operations for e.g.
		user => password field might require hashing the text
**/

var Context_Mongo = function (dbConnection, collectionName){
	this.db = dbConnection;
	this.collection = collectionName;
	var me = this;

	this.InitializeCollection = function(){
		//ensure index on email. Email is unique.
	};
};
Context_Mongo.prototype.close = function(){
	return this.db.Collection(this.collection).Close();
}
Context_Mongo.prototype.add = function(userobj){
	return this.db.Collection(this.collection).Insert(userobj);
};
Context_Mongo.prototype.list = function(){
	return this.db.Collection(this.collection).Find();		
};
Context_Mongo.prototype.find = function(obj,projection){
	return this.db.Collection(this.collection).Find(obj,projection);		
};

Context_Mongo.prototype.update = function (id, obj){
	return this.db.Collection(this.collection).Update(id,obj);
};

Context_Mongo.prototype.remove = function (id){
	return this.db.Collection(this.collection).Delete(id);
};

module.exports = Context_Mongo;