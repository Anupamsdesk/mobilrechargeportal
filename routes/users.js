//users.js
//USERS API

function Users(app, config){
	var users = config.userModel;
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
};

module.exports = Users;


	