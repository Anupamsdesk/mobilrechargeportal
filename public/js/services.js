'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
	.value('version', '0.1')	
	.factory('providerApiService',['$http','$q',function($http, $q){
		var rechargeNumber =function(number, amount, apiObject){
			var deferred = $q.defer();
			var p = ('Recharging '+ number +" with amount "+ amount +"...");
			p += "\n calling "+ apiObject.baseurl+apiObject.rechargeApi+" ...";
			if (((+amount)+ (+number))%13 > 5){
				p += 'success';
				deferred.resolve({
					"status": true,
					"log:": p
				});
			}else{
				p += 'failure';
				deferred.reject({
					"status": false,
					"log:": p
				});
			}
			return deferred.promise;
		};
		return{
			rechargeNumber: rechargeNumber
		};
	}])
	.factory('userService',['$http','$q', function ($http, $q){
		var baseUrl = "";//http://localhost:3000"
		var Urls = {
			userRegister: '/user/register',
			userLogin:'/user/login',
			validateSession: '/user/isvalid',
			phoneNumbers: '/phone',
			addPhoneNumber: '/phone/add',
			rechargePhoneNumber: '/phone/recharge',
			providers: '/provider'
		};
		var userRequestPost = function(url, data){        	
        	var config = {
        		'Accept':'application/json', 
                'Content-Type':'application/json'
            };        	
	        var deferred = $q.defer();
	        $http.post(baseUrl+url,data,config).
	        	success(function(data,status){
	            	deferred.resolve(data);
	        	}).error(function(response,status){
	        		console.log(status);
	        		console.log(response);
	            	deferred.reject(response);
	        	});
	        return deferred.promise;
	    	};
	    var userRequestGet = function(url, data){        	
        	var config = {
        		'Accept':'application/json', 
                'Content-Type':'application/json'
            };        	
	        var deferred = $q.defer();
	        $http.get(baseUrl+url,config).
	        	success(function(data,status){
	            	deferred.resolve(data);
	        	}).error(function(response,status){
	        		console.log(status);
	        		console.log(response);
	            	deferred.reject(response);
	        	});
	        return deferred.promise;
	    	};
    	 
		var registerUser = function(userObj){			
			return userRequestPost(Urls.userRegister, userObj);

			
		};
		var loginUser = function(userObj){
			console.log("loginUser called");
			return userRequestPost(Urls.userLogin, userObj);
		}
		var validateSession = function(){
			console.log("validateSession called");
			return userRequestGet(Urls.validateSession);
		}
		var phoneNumbers = function(){
			return userRequestGet(Urls.phoneNumbers);
		}
		var addPhoneNumber = function(obj){
			return userRequestPost(Urls.addPhoneNumber, obj);
		}
		var providers = function(){
			return userRequestGet(Urls.providers);
		}
		var recharge = function(obj){
			return userRequestPost(Urls.rechargePhoneNumber, obj);
		}


		return{
			registerUser: registerUser,
			loginUser: loginUser,
			validateSession: validateSession,
			phoneNumbers: phoneNumbers,
			addPhoneNumber:addPhoneNumber,
			providers: providers,
			recharge: recharge
		};

	}])
	;


/*
	*/
