//phone.api
//PHONE NUMBERS API
var Phones = function(app, config){
	var phones = config.phoneModel;
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
};
module.exports = Phones;