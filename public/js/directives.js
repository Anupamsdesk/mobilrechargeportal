'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('myItems', function(){
  	return {
        transclude : true,
        replace : false,
        scope : {
            heading : '=',
            subheading: '=',
            index : '=',            
        },
        restrict : 'E',
        templateUrl : 'partials/templates/accordianitem.html',
        link : function(scope, elm, attrs) {
            if (scope.index % 2 === 0) {
                scope.className = 'even-row';
            } else
                scope.className = 'odd-row';
        }
    };
  });
