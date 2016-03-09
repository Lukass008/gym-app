myApp.controller('loginController',
  ['$scope', '$location', 'AuthService', '$window',
  function ($scope, $location, AuthService, $window) {

      $scope.login = function () {

          $scope.error = false;
          $scope.disabled = true;

          // metoda logowanie z serwisu
          AuthService.login($scope.loginForm.username, $scope.loginForm.password)
              // sukces
              .then(function () {
                  $location.path('/');
                  $scope.disabled = false;
                  $scope.loginForm = {};
                  $window.location.reload();
              })
              // w przypadku gdy błąd
              .catch(function () {
                  $scope.error = true;
                  $scope.errorMessage = "Zły adres E-mail lub hasło";
                  $scope.disabled = false;
                  $scope.loginForm = {};
              });
      };
  }]);


myApp.controller('logoutController',
  ['$scope', '$location', 'AuthService', '$window',
  function ($scope, $location, AuthService, $window ) {

      $scope.logout = function () {

          // wylogowanie przy użyciu serwisu
          AuthService.logout()
              .then(function () {
                  $location.path('/login');
                  $window.location.reload();
              });

      };

  }]);


myApp.controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
      $scope.register = function () {
          $scope.error = false;
          $scope.disabled = true;

          // rejestracja z serwisu
          AuthService.register($scope.registerForm.username, $scope.registerForm.password, $scope.registerForm.name, $scope.registerForm.surname)
              //jeśli sukces
              .then(function () {
                  $location.path('/login');
                  $scope.disabled = false;
                  $scope.registerForm = {};
              })
              // jeśli błąd
              .catch(function () {
                  $scope.error = true;
                  $scope.errorMessage = "Ups, coś poszło nie tak...";
                  $scope.disabled = false;
                  $scope.registerForm = {};
              });
      };
  }]);


myApp.controller('navigationBar',
  ['$scope', '$http',
  function($scope, $http){

      $http.get('user/basicData')
          .success(function(data){
              $scope.basicData = data;
              console.log(data);
          })
          .error(function (data){
              console.log('Error: '+data);
          });
  }]);