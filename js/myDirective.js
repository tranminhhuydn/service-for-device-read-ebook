(function(angular) {
'use strict';
angular.module('myDirective', ['socket'])

  .directive('myTabs', function() {
    return {
      //require: 'ctrlUsers',
      restrict: 'E',
      transclude: true,
      scope: {
        init:'&onInit'
      },
      controller: ['$scope', function MyTabsController($scope) {
        var panes = $scope.panes = [];
        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        };

        this.addPane = function(pane) {
          if (panes.length === 0) {
            $scope.select(pane);
          }
          panes.push(pane);
        };
        $scope.self = $scope
      }],
      templateUrl: 'my-tabs.html'
    };
  })
  .directive('myPane', function() {
    return {
      require: '^myTabs',
      restrict: 'E',
      transclude: true,
      scope: {
        title: '@',
        icon: '@'
      },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
       },
      templateUrl: 'my-pane.html'
    };
  })
  .directive('myLogin', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs, ctrls) {
       },
      templateUrl: 'login-tpm.html'
    };
  })
  .directive('myRegister', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs, ctrls) {
       },
      templateUrl: 'register-tpm.html'
    };
  })
  .directive('myGetHeight',['$interval' ,function($interval) {
    return {
      link: function(scope, element, attrs,ctrls){ 
        var h = document.body.offsetHeight
        element[0].style.height = h-150+"px"
      }
    };
  }])


})(window.angular);