// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers'])
// .run(function($ionicPlatform) {
//   console.log(localStorage)

//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs)
//   if (window.cordova && window.cordova.plugins.Keyboard) {
//     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//     cordova.plugins.Keyboard.disableScroll(true);

//   }
//   if (window.StatusBar) {
//       // org.apache.cordova.statusbar required
//       StatusBar.styleDefault();
//     }
//   });
// })

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
  })

  .state('app.like', {
    url: '/like',
    views: {
      'menuContent': {
        templateUrl: 'templates/like.html',
        controller: 'LikeCtrl',
      }
    }
  })

  .state('app.dislike', {
    url: '/dislike',
    views: {
      'menuContent': {
        templateUrl: 'templates/dislike.html',
        controller: 'DislikeCtrl',
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
      }
    }
  })

  .state('app.profil', {
    url: '/profil',
    views: {
      'menuContent': {
        templateUrl: 'templates/profil.html',
        controller: 'ProfilCtrl'
      }
    }
  })
  .state('app.messenger', {
    url: '/messenger/{userid}',
    views: {
      'menuContent': {
        templateUrl: 'templates/messenger.html',
        controller: 'MessengerCtrl'
      }
    }
  })
  .state('app.geo', {
    url: '/geo',
    views: {
      'menuContent': {
        templateUrl: 'templates/geo.html',
        controller: 'GeoCtrl'
      }
    }
  })
  .state('app.match', {
    url: '/match',
    views: {
      'menuContent': {
        templateUrl: 'templates/match.html',
        controller: 'MatchCtrl'
      }
    }
  })


  .state('app.register', {
    url: '/register',
    views: {
      'menuContent': {
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
      }
    }
  })
  .state('app.myprofil', {
    url: '/myprofil',
    views: {
      'menuContent': {
        templateUrl: 'templates/myprofil.html',
        controller: 'MyprofilCtrl'
      }
    },
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/profil');
});
