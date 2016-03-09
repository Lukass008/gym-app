myApp.factory('AuthService',
  ['$q', '$timeout', '$http', '$cookieStore',
  function ($q, $timeout, $http, $cookieStore) {

    //utworzenie cookie z tokenem identyfinacyjnym i ustawainie go w domyślnym nagłówku żądania
    var cookiesUser = $cookieStore.get('token');
    $http.defaults.headers.common['x-access-token'] = cookiesUser;

    // zwraca dostępne funkcję do użytku dla kontrolera
    return ({
      isLoggedIn: isLoggedIn,
      //getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

    //sprawdzenie czy użytkownik jest zalogowany
    function isLoggedIn() {
      if(cookiesUser) {
        return true;
      } else {
        return false;
      }
    }

    ////sprawdzenie statusu usera
    //function getUserStatus() {
    //  $http.get('/user/status')
    //  // sukces
    //  .success(function (data) {
    //    if(data.status){
    //      cookiesUser = true;
    //    } else {
    //      cookiesUser = false;
    //    }
    //  })
    //  // error
    //  .error(function (data) {
    //    cookiesUser = false;
    //  });
    //}

    function login(username, password) {

      // nowa instancja deferred
      var deferred = $q.defer();

      // wysłanie żądania post do serwera
      $http.post('/user/login',
        {username: username, password: password})
        // sukces
        .success(function (data, status) {
          if(status === 200 && data.status){
            // dodanie cookie token w celu identyfikacji użytkownika
            var token = data.token;
            $cookieStore.put('token', token);
            cookiesUser = true;
            deferred.resolve();
          } else {
            cookiesUser = false;
            deferred.reject();
          }
        })
        // error
        .error(function (data) {
          cookiesUser = false;
          deferred.reject();
        });

      // zwrócenie obiektu promise
      return deferred.promise;

    }

    function logout() {

      // nowa instancja deferred
      var deferred = $q.defer();

      // żądanie get do serwera (wyloguj)
      $http.get('/user/logout')
        // sukces
        .success(function (data) {
          cookiesUser = false;
          $cookieStore.remove('token');
          deferred.resolve();
          console.log('Wylogowano');
        })
        // error
        .error(function (data) {
          cookiesUser = false;
          deferred.reject();
        });

      return deferred.promise;

    }

    function register(username, password, name, surname) {

      // nowa instancja deferred
      var deferred = $q.defer();

      // żądanie post do serwera (zarejestruj)
      $http.post('/user/register',
        {username: username, password: password, name: name, surname: surname})
        // sukces
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // error
        .error(function (data) {
          deferred.reject();
        });

      // obiekt promise
      return deferred.promise;

    }

}]);