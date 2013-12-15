
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  //, api = require('./routes/api')
  , config = require('./config')
  , util = require('util')
  ;
var users = config.userModel;
var phones = config.phoneModel;
var providers = config.providerModel;
var transactions = config.transactionModel;

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
app.set('port', process.env.PORT || 3000);

console.log(process.env);
  

// Configuration
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));  

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('dskljkdsjkldjsjlkdjsjljsdkljljs'));
app.use(express.session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
//app.use(express.session());
app.use(app.router);


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// Routes

app.get('/provider', function(req,res){
  providers.find().then(function(data){
    res.send({"status":"success", "data": data});
  }, function(eer){
    res.send({"status":"failure"});
  });
});

app.get('/phone', function(req,res){
  if (req.session && req.session.user){
    phones.findForUser(req.session.user._id).then(function(data){
      res.send({"status":"success", "data": data});
    });
  }else res.redirect('/');
});
app.post('/phone/add', function(req,res){
  if (req.session && req.session.user){
    var obj = req.body;
    //obj.userId = req.session.user._id;        
    phones.create(obj, req.session.user._id).then(function(data){
      var data={};
      res.send({"status":"success", "data": data});
    });
  }else res.redirect('/');
});
app.post('/phone/recharge', function(req,res){
  if (req.session && req.session.user){
    console.log(req.body);
    var b = req.body;
    phones.updateBalance(req.session.user._id, req.body.number, req.body.balance, function(obj){
        if (obj){
          transactions.insert(req.session.user._id, req.body.number, req.body.balance,
              req.body.provider, req.body.area, req.body.circle
            ).then(function(val){
              res.send({"status": true});
            }, function(err){
              res.send({"status":false});
            });
        }else res.send({"status":obj});  
    });
    
  }else{
    res.send({'status': 'invalid login'});
  }
});


app.post('/user/register', function(req,res){    
    var userobj = req.body;    
    users.findByEmail(userobj.Email).then(function(obj){    
      if (obj && obj.length > 0){        
        res.send({"status":"failure", "msg":"user already exists with the email"});  
      }else{    
        users.create(userobj).then(function(obj){
          console.dir(obj);  
          res.send({"status": "success"});
          },function(ero) {console.dir(ero); res.send({"status": "failure"});
        });
      }
    }); /**/         
});

app.post('/user/login', function(req,res){
  var userobj = req.body;
  //console.dir(userobj);
  users.validateUser(userobj.Email, userobj.Password, function(value, obj){
    console.log(value);
    if (!value){      
      res.send({"status": "failure", "msg":"Invalid Login!"});
    }else{
      req.session.regenerate(function(){
        console.log('from regenerate');
        //console.log(obj);
        req.session.user = obj;  
        req.session.save(function(err){
          if (err) console.error(err.stack);
            //debug('saved');
            //res.end(data, encoding);
        });
        console.dir(req.session);        
      });     
      res.redirect("/");
      //console.log(req.session) ;
      //res.send({"status": "success"});
    }
  });    
});

app.post('/user/logout', function(req,res){  
  req.session.destroy();
  res.redirect("/");
});


app.get('/user/isvalid', function(req,res){  
  if (req.session && req.session.user)
    res.send({"status": true , "user": req.session.user});
  else res.send({"status": false});
});

function errorHandler(err,req,res){
  console.log(err);
  res.send({"status": "error", "msg": err});
}

//app.get('/', routes.index);
//app.get('/partials/:name', routes.partials);

// JSON API
/*
app.get('/api/posts', api.posts);
app.get('/api/post/:id', api.post);
app.post('/api/post', api.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);
*/

app.get('/', function(req, res) {  
    res.render('index.html');
});


http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
