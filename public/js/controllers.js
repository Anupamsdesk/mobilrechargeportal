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
function userRegistrationCtrl($scope,$location,userService){
	$scope.message="Register user";
	$scope.notProcessing=true;
	$scope.login= function(){
		$location.url('/login');
	}
	$scope.submit = function(){
		$scope.notProcessing=false;
		$scope.message="registering user please wait...";
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
				$scope.notProcessing=true;
			},function(err){
				console.dir(err);
				console.log('connect failure');
				$scope.notProcessing=true;
				$scope.message = "Sorry! Some error occured!";
			});
		
	}	
}
function loginCtrl($scope,$location,userService){
	$scope.message="please enter your registered email id and password";
	$scope.notProcessing=true;
	$scope.submit = function(){
		$scope.notProcessing=false;
		$scope.message="logging please wait...";
		//console.log("I am userRegistrationCtrl Controller");	
		var userObj = {				
				Password: $scope.password,
				Email: $scope.uname
		};
		console.log('submitted!');
		var promise = userService.loginUser(userObj);
		promise.then(function(data){				
				$scope.message="done!";
				if (data.status === "failure")
					$scope.message="Sorry! "+ data.msg;
				else{
					$scope.message="Login Success";	
					$location.url('/user');
				}
				$scope.notProcessing=true;
					
			},function(err){
				console.dir(err);
				console.log('connect failure');
				$scope.message = "Sorry! Some error occured!";
				$scope.notProcessing=true;
			});

	}	
}
function userCtrl($scope,$location,userService){
	$scope.message="loading..."
	$scope.notProcessingAdd=true;
	$scope.showLoading=true;

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
		$scope.showLoading=true;
		validateSession();
		$scope.message="loading..."
		userService.phoneNumbers().then(function(obj){
			console.dir(obj);
			$scope.groupList=[];
			$scope.phoneList=[];
			if (!obj.data || obj.data.length === 0){
				$scope.message = "Start by adding a few phone numbers";
				$scope.mainList=[];				
			}else{
				$scope.mainList=obj.data;
				$scope.message="Loaded successfully!"
			}
			$scope.showLoading=false;
			for(var i=0; i<$scope.mainList.length; i++){
				$scope.phoneList.push($scope.mainList[i]);
			}
		},function(err){
			$scope.showLoading=false;
			$scope.message = "some error occured";
			console.dir(err);
		});
	};
	$scope.addNewNumber = function(){
		$scope.notProcessingAdd = false;
		validateSession();
		var ind = getIndexFor( $scope.newnumber, $scope.mainList) ;
		if (ind >=0){
			$scope.message="This number already exists!";
			$scope.notProcessingAdd = true;
			return;
		}
		$scope.message = "adding new number....";
		userService.addPhoneNumber({Number: $scope.newnumber}).then(function(obj){
			$scope.message = "done!";
			$scope.getPhoneNumbers();
			$scope.notProcessingAdd = true;
		},function(err){
			$scope.message = "some error occured";
			console.dir(err);
			$scope.notProcessingAdd = true;
		});
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
		//console.log("RECHARGE");
		$location.url('/recharge?numbers='+num+";");
	};

	$scope.rechargeNums = function(){
		//console.log("RECHARGE");
		var str='';
		$scope.groupList.forEach(function(item){
			str+=item.Number+";"
		});
		$location.url('/recharge?numbers='+str);
	};

	$scope.deleteNum = function(num){
		//console.log("DELETE");
		$scope.message = "delete was not implemented!";
	};
	$scope.groupNum = function(num){
		var ind = getIndexFor(num,$scope.phoneList);
		$scope.groupList.push($scope.phoneList[ind]);
		$scope.phoneList.splice(ind,1);
	};

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



function rechargeCtrl($scope,$location,userService, providerApiService){
	$scope.numbers=[];
	$scope.showLoading=true;
	$scope.message='loading please wait...';
	var x = $location.search();
	$scope.numbers = x.numbers.split(";")
	$scope.numbers.pop();
	$scope.providersList =[]; 
	$scope.countries=[];
	$scope.selectedProvider='';
	$scope.selectedCountry = '';
	$scope.selectedArea ='';

	$scope.result=[];

	$scope.amount=0.0;
	$scope.id='';
	$scope.password='';

	userService.providers().then(function(obj){
			console.dir(obj);
			$scope.providersList={};
			obj.data.forEach(function(item){
				$scope.providersList[item.name] = item;
			});						
			$scope.selectedProvider = obj.data[0].name;
			$scope.changeProvider();
			$scope.message='loaded successfully!';
			$scope.showLoading=false;
		},function(err){
			console.dir(err);
			$scope.showLoading=false;
			$scope.message='sorry! some error occured!';
		});
	$scope.changeProvider=function(){
		console.log('change provider called!');
		$scope.loadCountries();
	}
	$scope.changeCountry=function(){
		console.log('change provider called!');
		$scope.loadAreas();
	}

	$scope.loadCountries = function(){
		var subs = $scope.providersList[$scope.selectedProvider].subProviders;
		$scope.countries=[];

		subs.forEach(function(item){
			$scope.countries.push(item.country);
		});
		$scope.selectedCountry = $scope.countries[0];
		$scope.loadAreas();
	}
	$scope.loadAreas = function(){
		var subs = $scope.providersList[$scope.selectedProvider].subProviders;
		$scope.areas = [];
		subs.forEach(function(item){
			if (item.country === $scope.selectedCountry){
				item.circles.forEach(function(circle){
					$scope.areas.push(circle.name);
				});
				$scope.selectedArea = $scope.areas[0];
			}
		})
	};

	$scope.rechargeClick = function(){
		$scope.showLoading=true;
		$scope.result=[];
		$scope.message='';
		if ($scope.amount>0.0 && $scope.id !== '' && $scope.password !==''){
			console.log('validated');
			$scope.numbers.forEach(function(item){
				providerApiService.rechargeNumber(item,$scope.amount,
				$scope.providersList[$scope.selectedProvider]).then(function(data){
					console.log(data);
					$scope.showLoading=false;
					if (data.status){

						$scope.result.push({'number': item, 'status': 'success'});

						userService.recharge(
							{	'number': item, 
								'balance':$scope.amount,
								'provider': $scope.selectedProvider,
								'area':$scope.selectedCountry,
								'circle': $scope.selectedArea
							}).then(function(obj){											
						},function(err){
							$scope.message="There was problem syncing the recharge amount with server"
						});

					}else $scope.result.push({'number': item, 'status': 'failure'});
				}, function(err){
					$scope.result.push({'number': item, 'status': 'failure'});
					console.log(err);	
					$scope.showLoading=false;				
				});
			});
			//$scope.$new().$digest();
		}else{
			console.log('Invalid');
			$scope.message='Invalid inputs!'	
			$scope.showLoading=false;		
		}
	};


};

angular.module('myApp.controllers', [])
	.controller('aboutCtrl', aboutCtrl)
	.controller('indexCtrl', ['$scope','$http','$location','userService',indexCtrl])
	.controller('mainCtrl', ['$scope','$location','userService',mainCtrl])
	.controller('userRegistrationCtrl', ['$scope','$location','userService',userRegistrationCtrl])
	.controller('loginCtrl', ['$scope','$location','userService',loginCtrl])
	.controller('userCtrl', ['$scope','$location','userService',userCtrl])
	.controller('rechargeCtrl', ['$scope','$location','userService','providerApiService',rechargeCtrl])
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
