'use strict';

/* Controllers */
function aboutCtrl($scope){
	console.log('I am about controller');
}
function indexCtrl($scope, $http, $location, userService){
	console.log("I am Index Controller");
	userService.validateSession().then(function(data){
		console.log(data);
		if (data.status && data.status===true) 
			$location.url("/user");
	},function(err){
		//$location.url("/home");
	});
	//$http.get('/api/posts').
	//success(function(data,status,headers,config){
	//	$scope.posts = data.posts;
	//});
}
function mainCtrl($scope,$location){
	$location.url('/home');
}
function userRegistrationCtrl($scope,userService){
	$scope.message="Register user";
	$scope.submit = function(){
		//console.log("I am userRegistrationCtrl Controller");	
		var userObj = {
				FirstName: $scope.fname, 
				LastName:$scope.lname, 
				Password: $scope.password,
				Email: $scope.email
		};

		var promise = userService.registerUser(userObj, $scope.message);
		promise.then(function(data){
				console.log('connect success');
				if (data.status === "failure")
					$scope.message="Sorry! "+ data.msg;
				else
					$scope.message="Congratulations! User is registered"
			},function(err){
				console.dir(err);
				console.log('connect failure');
				$scope.message = "Sorry! Some error occured!";
			});
		
	}	
}
function loginCtrl($scope,$location,userService){
	$scope.message="login";
	$scope.submit = function(){
		//console.log("I am userRegistrationCtrl Controller");	
		var userObj = {				
				Password: $scope.password,
				Email: $scope.uname
		};
		console.log('submitted!');
		var promise = userService.loginUser(userObj);
		promise.then(function(data){
				console.log('connect success');
				if (data.status === "failure")
					$scope.message="Sorry! "+ data.msg;
				else{
					$scope.message="Login Success";	
					$location.url('/user');
				}
					
			},function(err){
				console.dir(err);
				console.log('connect failure');
				$scope.message = "Sorry! Some error occured!";
			});

	}	
}
function userCtrl($scope,$location,userService){
	function validateSession(){
		userService.validateSession().then(function(data){
		console.log(data);
		if (data.status && data.status===true){
			$scope.user = data.user;
		}else{
			$location.url("/home");			
		}		
		},function(err){
			$location.url("/home");
		});
	}
	//validateSession();
	$scope.mainList = [];
	$scope.phoneList=[];
	$scope.searchNumber="";
	//$scope.searchedList="";
	$scope.groupList="";

	$scope.message="";
	

	$scope.getPhoneNumbers = function(){
		validateSession();
		userService.phoneNumbers().then(function(obj){
			console.dir(obj);
			$scope.groupList=[];
			$scope.phoneList=[];
			if (!obj.data || obj.data.length === 0){
				$scope.message = "Empty list";
				$scope.mainList=[];				
			}else{
				$scope.mainList=obj.data;
			}
			for(var i=0; i<$scope.mainList.length; i++){
				$scope.phoneList.push($scope.mainList[i]);
			}
		},function(err){
			console.dir(err);
		});
	};
	$scope.addNewNumber = function(){
		validateSession();
		var ind = getIndexFor( $scope.newnumber, $scope.mainList) ;
		if (ind >=0){
			$scope.message="This number already exists!";
			return;
		}
		userService.addPhoneNumber({Number: $scope.newnumber}).then(function(obj){
			console.dir(obj);
			$scope.getPhoneNumbers();
		},function(err){
			console.dir(err);
		})
	};

	$scope.numberSearch = function(){
		var i = 0;
		$scope.phoneList = [];
		if ($scope.searchNumber.length === 0){
				
			for(i=0; i<$scope.mainList.length; i++){
				$scope.phoneList.push($scope.mainList[i]);
			}			
		}else{
		
			for(i=0; i<$scope.mainList.length; i++){
				if ($scope.mainList[i].Number.toString().indexOf($scope.searchNumber)>-1)
					$scope.phoneList.push($scope.mainList[i]);
			}	
		}
		//console.dir(ab1);
		//console.dir(ab2);
	}

	$scope.rechargeNum = function(num){
		console.log("RECHARGE");
	};
	$scope.deleteNum = function(num){
		console.log("DELETE");
	};
	$scope.groupNum = function(num){
		var ind = getIndexFor(num,$scope.phoneList);
		$scope.groupList.push($scope.phoneList[ind]);
		$scope.phoneList.splice(ind,1);
	};

<<<<<<< HEAD
	$scope.ungroupNum = function(num){
		var ind = getIndexFor(num,$scope.groupList);
		$scope.phoneList.push($scope.groupList[ind]);
		$scope.groupList.splice(ind,1);
	};
	var getIndexFor = function(num,containerArray){
		var ind = -1;
		for(var i=0; i<containerArray.length; i++){
			if (containerArray[i].Number === num){
				ind = i;
				break;
			}
		}
		return ind;
	}


	$scope.getPhoneNumbers();

}
angular.module('myApp.controllers', [])
	.controller('aboutCtrl', aboutCtrl)
	.controller('indexCtrl', ['$scope','$http','$location','userService',indexCtrl])
	.controller('mainCtrl', ['$scope','$location','userService',mainCtrl])
	.controller('userRegistrationCtrl', ['$scope','userService',userRegistrationCtrl])
	.controller('loginCtrl', ['$scope','$location','userService',loginCtrl])
	.controller('userCtrl', ['$scope','$location','userService',userCtrl])
	;

/*
function AppCtrl($scope, $http) {
  $http({method: 'GET', url: '/api/name'}).
  success(function(data, status, headers, config) {
    $scope.name = data.name;
  }).
  error(function(data, status, headers, config) {
    $scope.name = 'Error!'
  });
}

function IndexCtrl($scope, $http){
	console.log("I am Index Controller");
	//$http.get('/api/posts').
	//success(function(data,status,headers,config){
	//	$scope.posts = data.posts;
	//});
}

function AddPostCtrl($scope, $http, $location){
	$scope.form = {};
	$scope.submitPost= function (){
		$http.post('/api/post', $scope.form).
			success(function(data){
				$location.path('/');
			});
	};
	
}
function EditPostCtrl($scope, $http, $routeParams){
	$http.get('/api/post/'+ $routeParams.id).
		success(function(data){
			$scope.post = data.post;
		});
	
}
function ReadPostCtrl($scope, $http, $routeParams){
	$http.get('/api/post/'+ $routeParams.id).
		success(function(data){
			$scope.post = data.post;
		});
}

function EditPostCtrl($scope, $http, $location, $routeParams){
	$scope.form={};
	$http.get('/api/post/'+ $routeParams.id).
		success(function(data){
			$scope.form = data.post;
		});
	$scope.editPost = function (){
		$http.put('/api/post/'+$routeParams.id).
			success(function(data){
				$location.url('/Post/'+$routeParams.id);
			});		
	};
}

function DeletePostCtrl($scope, $http, $location, $routeParams){
	$scope.form={};
	$http.get('/api/post/'+ $routeParams.id).
		success(function(data){
			$scope.form = data.post;
		});
	$scope.deletePost = function (){
		$http.put('/api/post/'+$routeParams.id).
			success(function(data){
				$location.url('/');
			});		
	};
	$scope.home = function(){
		$location.url('/');
	};
}*/
