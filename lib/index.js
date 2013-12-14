//index.js

var context = require('./context');
var db = require('./mongo');

module.exports = {
	  dbContext: context
	, dbService: db
};

