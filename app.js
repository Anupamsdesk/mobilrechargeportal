
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , config = require('./config')
  , util = require('util')
  ;

var app = module.exports = express();
app.set('port', process.env.PORT || 3000);

// Configuration
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));  
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('dskljkdsjkldjsjlkdjsjljsdkljljs'));
app.use(express.session({ secret: 'keyboard cat', 
  maxAge  : new Date(Date.now() + 3600000), //1 Hour
  expires : new Date(Date.now() + 3600000), 
  cookie: { 
    maxAge  : new Date(Date.now() + 3600000), //1 Hour
    expires : new Date(Date.now() + 3600000), 
 }}));
app.use(app.router);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
routes(app, config);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
