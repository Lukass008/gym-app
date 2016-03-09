var myApp = angular.module('myApp', ['ui.router', 'ngRoute', 'ngCookies']);

// konfiguracja stanów oraz routingu
myApp.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

      // stan strony głównej - jeśli użytkownik zalogowany
    .state('home', {
      url: '/',
      templateUrl: 'partials/home.html',
      // autentykacja użytkownika
      resolve: { authenticate: authenticate }
    })

      .state('home.profile', {
        url: 'profile',
        templateUrl: 'partials/profile.html',
        resolve: { authenticate: authenticate }
      })

      .state('home.trainings', {
        url: 'trainings',
        templateUrl: 'partials/trainings.html',
        resolve: { authenticate: authenticate }
      })

      .state('home.trnplan', {
        url: 'trnplan',
        templateUrl: 'partials/trnplan.html',
        resolve: { authenticate: authenticate }
      })

      .state('home.stats', {
        url: 'stats',
        templateUrl: 'partials/stats.html',
        resolve: { authenticate: authenticate }
      })

      // stan startowy - użytkownik niezalogowany, brak autoryzacji
    .state('start', {
      templateUrl: 'partials/start.html',
      //controller: 'loginController',
    })

      // logowanie użytkownika
    .state('start.login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'loginController',
    })

      // wylogowanie
    .state('logout', {
      url: '/logout',
      controller: 'logoutController',
      resolve: { authenticate: authenticate }
    })

    .state('start.register', {
      url: '/register',
      templateUrl: 'partials/register.html',
      controller: 'registerController',
    });

  // przekierowanie w przypadku wpisania innego adresu do przeglądarki
  $urlRouterProvider.otherwise('/');
});


//autentykacja użytkownika
function authenticate($q, AuthService, $state, $timeout, $cookieStore) {
  console.log('Autoryzacja użytkownika...');
  // wykorzystanie serwisu AuthService do sprawdzenia czy użytkownik jest zalogowany
  if (AuthService.isLoggedIn()) {
    return $q.when();
  }
  else {
    $timeout(function() {
      // ten kod sięwykona jeśli autentykacja nie przebiegnie prawidłowo
      // przekierowanie do stanu strony logowania
      $state.go('start.login');
    });

    return $q.reject()
  }
}


