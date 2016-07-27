angular.module('starter.controllers', ['ionic', 'ionic.contrib.ui.tinderCards2', 'ngCordova'])

.service('UserService', function() {

  var setUser = function(user_data) {

    window.localStorage.user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser,

  };
})

.service('GeoService', function() {

  var setGeo = function(like) {

    window.localStorage.geo = JSON.stringify(like);
  };

  var getGeo = function(){
    return JSON.parse(window.localStorage.geo || '{}');
  };

  return {
    getGeo: getGeo,
    setGeo: setGeo,

  };
})
.factory('ProfilService', function ($http, $q, UserService, GeoService) {
  var url;
  var data;
  var check = UserService.getUser('user');
  var geo = GeoService.getGeo('geo');
  if (geo.geo === true) {
    url = 'http://192.168.0.105:1337/geo/geosearch';
     data = {userid: check.id, dist: geo.peri};
  } else {
    url = 'http://192.168.0.105:1337/myprofil/profil';
    data = {userid: check.id};
  }
  return {
    profils: function() {
      return $http.post(url, data)
      .then(function(response) {
        if (typeof response.data === 'object') {
          return response.data;
        } else {
          return $q.reject(response.data);
        }

      }, function(response) {
        return $q.reject(response.data);
      });
    }
  };
})


  // var check = UserService.getUser;
  // console.log(check)
// .directive('check', function($location) {
// if(check.userID){
//   // alert('totot')
//   $location.path('/app/home')
// }

// })

// .directive('noScroll', function($document) {

//   return {
//     restrict: 'A',
//     link: function($scope, $element, $attr) {

//       $document.on('touchmove', function(e) {
//         e.preventDefault();
//       });
//     }
//   }
// })
.directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  };
})


.controller('AppCtrl', function($scope, $ionicModal, $timeout, UserService, $location) {

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    // console.log($scope.loginData.username)
    // console.log('Doing login', $scope.loginData);


    $.ajax({
      url: 'http://192.168.0.105:1337/login',
      crossDomain: true,
      type: 'post',
      dataType: 'json',
      data: {email: $scope.loginData.username, password: $scope.loginData.password},
      success: function(data) {

        UserService.setUser({
          connexion : true,
          age : data.infoC[0].age,
          email : data.infoC[0].email,
          id : data.infoC[0].id,
          password : data.infoC[0].password,
          pseudo : data.infoC[0].pseudo,
          createdAt : data.infoC[0].createdAt

        });
        $location.path('app/profil');
      }

    }).done(function(data) {
    })
    .fail(function() {
    })
    .always(function() {
    });

    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
  { title: 'Reggae', id: 1 },
  { title: 'Chill', id: 2 },
  { title: 'Dubstep', id: 3 },
  { title: 'Indie', id: 4 },
  { title: 'Rap', id: 5 },
  { title: 'Cowbell', id: 6 }
  ];
})
.controller('RegisterCtrl', function($scope, $stateParams, UserService, $location) {

 $scope.register = function(sexe) {

  if ($scope.loginData.password == $scope.loginData.passwordc) {

    $.ajax({
      url: 'http://192.168.0.105:1337/user/create',
      crossDomain: true,
      type: 'post',
      dataType: 'json',
      data: 
      {
        age: $scope.loginData.age,
        email: $scope.loginData.email,
        pseudo: $scope.loginData.pseudo,
        sexe: sexe,
        password: $scope.loginData.passwordc
      },
      success: function(data) {
        UserService.setUser({
          connexion : true,
          age : data.age,
          email : data.email,
          id : data.id,
          password : data.password,
          pseudo : data.pseudo,
          createdAt : data.createdAt

        });
        $.ajax({
          url: 'http://192.168.0.105:1337/myprofil/myprofil',
          crossDomain: true,
          type: 'post',
          dataType: 'json',
          data: 
          {
            userid: data.id,

          },
          success: function(data) {
            $location.path('/app/profil');

          }
        });
      }
    });


  } else {

    $scope.errors = 'Les mots de passe ne corresponde pas.';
  }

};
})

.controller('ProfilCtrl', function($scope, $stateParams, TDCardDelegate, $timeout, UserService,$ionicHistory, $location, $q, ProfilService) {
  $scope.$on("$ionicView.enter", function(event, data){
    var check = UserService.getUser('user');
    if (check.connexion === undefined || check.connexion === null) {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $location.path('/app/login');
    }
    PromiseProfil();
  });
  var PromiseProfil = function() {
    ProfilService.profils()
    .then(function(data) {
      if (data.profil.length !== 0) {
        time(data);
      } else {
        time();                 }
      }, function(error) {
        time();           
      });
  };
  var time = function(toto) {

    var cardTypes = [];
    for (var i = 0; i < toto.profil.length; i++) {

      cardTypes.push({image: toto.profil[i].image, userid: toto.profil[i].userid});

    }

    $scope.cards = {
      master: Array.prototype.slice.call(cardTypes, 0),
      active: Array.prototype.slice.call(cardTypes, 0),
      discards: [],
      liked: [],
      disliked: []
    };

    $scope.cardDestroyed = function(index) {
      $scope.cards.active.splice(index, 1);
    };

    $scope.addCard = function() {
      var angular;
      var newCard = cardTypes[0];
      $scope.cards.active.push(angular.extend({}, newCard));
    };

    $scope.refreshCards = function() {
      $scope.cards.active = null;
      $timeout(function() {
        $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
      });
    };

    $scope.$on('removeCard', function(event, element, card) {
      var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
      $scope.cards.discards.push(discarded);
    });

    $scope.cardSwipedLeft = function(index, userid) {
      var check = UserService.getUser('user');
      $.ajax({
        url: 'http://192.168.0.105:1337/like/likes',
        crossDomain: true,
        type: 'post',
        dataType: 'json',
        data: 
        {
          useridL: check.id,
          userid: userid,
          like: 0,
        },
        success: function(data) {

        }
      });
      
      var card = $scope.cards.active[index];
      $scope.cards.disliked.push(card);
    };
    $scope.cardSwipedRight = function(index, userid) {
      var check = UserService.getUser('user');
      $.ajax({
        url: 'http://192.168.0.105:1337/like/likes',
        crossDomain: true,
        type: 'post',
        dataType: 'json',
        data: 
        {
          useridL: check.id,
          userid: userid,
          like: 1,
        },
        success: function(data) {

        }
      });
      
      var card = $scope.cards.active[index];
      $scope.cards.liked.push(card);
    };
  };



})
.controller('CardCtrl', function($scope, TDCardDelegate) {

})

.controller('GeoCtrl', function($scope, $cordovaGeolocation, UserService, $location,$ionicHistory, GeoService) {

  $scope.$on("$ionicView.beforeEnter", function(event, data){
   var check = UserService.getUser('user');
   if (check.connexion === undefined || check.connexion === null) {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $location.path('/app/login');
  }

});
  $scope.register = function() {
    var geo;
   if ($scope.loginData.checkbox === undefined || $scope.loginData.checkbox === null || $scope.loginData.checkbox === false)
    geo = false;
  else
    geo = true;
  GeoService.setGeo({
    geo: geo,
    peri: $scope.loginData.age+"000"

  });
  location.reload();
  $location.path('/app/profil');
};

var posOptions = {timeout: 10000, enableHighAccuracy: false};
$cordovaGeolocation
.getCurrentPosition(posOptions)

.then(function (position) {
 var check = UserService.getUser('user');
 var lat  = position.coords.latitude;
 var long = position.coords.longitude;
 $.ajax({
  url: 'http://192.168.0.105:1337/geo/geoinsert',
  crossDomain: true,
  type: 'post',
  dataType: 'json',
  data: 
  {
    userid: check.id,
    lat: lat,
    lng: long,
  },
  success: function(data) {

  }
});
}, function(err) {
 
});

var watchOptions = {timeout : 100, enableHighAccuracy: false};
var watch = $cordovaGeolocation.watchPosition(watchOptions);

watch.then(
  null,

  function(err) {
   
 },

 function(position) {
   // var lat  = position.coords.latitude;
   // var long = position.coords.longitude;
 }
 );

watch.clearWatch();

})


.controller('MatchCtrl', function($scope, UserService, $location, $ionicHistory) {

  $scope.$on("$ionicView.beforeEnter", function(event, data){
   var check = UserService.getUser('user');
   if (check.connexion === undefined || check.connexion === null) {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $location.path('/app/login');
  }


  check = UserService.getUser('user');

  $.ajax({
    url: 'http://192.168.0.105:1337/like/match',
    crossDomain: true,
    type: 'post',
    dataType: 'json',
    data: 
    {
      userid: check.id,
    },
    success: function(data) {
      $scope.dislike = data.match;
    }
  });
});

})

.controller('MessengerCtrl', function($scope, $timeout, $ionicScrollDelegate, $location, UserService, $ionicHistory, $stateParams) {

  var check = UserService.getUser('user');

  $scope.$on("$ionicView.enter", function(event, data){

    var check = UserService.getUser('user');
    if (check.connexion === undefined || check.connexion === null) {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $location.path('/app/login');
    }
  });
  var histo = function() {
    $.ajax({
      url: 'http://192.168.0.105:1337/messenger/history',
      crossDomain: true,
      type: 'post',
      dataType: 'json',
      data: 
      {
        useridS: check.id,
        useridR : $stateParams.userid,
      },
      success: function(data) {

        // var messages;
        $scope.messages = [];
        for (var i = 0; i < data.history.length; i++) {
          $scope.myId = check.id;
          $scope.messages.push({
            userId: data.history[i].useridR,
            text: data.history[i].message,
            time: data.history[i].data
          });
        }
      }
    });
  };
  window.setInterval(histo,1000);


  $scope.sendMessage = function() {

    var check = UserService.getUser('user');
    var d = new Date();
    d = d.toLocaleString();

    $.ajax({
      url: 'http://192.168.0.105:1337/messenger/create',
      crossDomain: true,
      type: 'post',
      dataType: 'json',
      data: 
      {
        useridS: check.id,
        useridR : $stateParams.userid,
        message :$scope.data.message,
        data : d
      },
      success: function(data) {
        $scope.dislike = data.match;
      }
    });

    $scope.hideTime = true;

    // alternate,
    // alternate = !alternate;
    d = new Date();
    d = d.toLocaleString();

    $scope.messages.push({
      text: $scope.data.message,
      time: d
    });

    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);

  };


  $scope.inputUp = function() {
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };


  $scope.data = {};
  $scope.myId = '36';
  $scope.messages = [];

})

.controller('MyprofilCtrl', function($scope, $timeout, $ionicHistory,$cordovaFileTransfer, $cordovaImagePicker, $ionicScrollDelegate, $cordovaFile, $ionicPopup, UserService, $location) {

  $scope.$on("$ionicView.enter", function(event, data){
    var check = UserService.getUser('user');
    if (check.connexion === undefined || check.connexion === null) {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $location.path('/app/login');
    }
  });
  $scope.getImageSaveContact = function() {       

    var options = {

      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 80

    };

    var cBase64;
    $cordovaImagePicker.getPictures(options).then(function (results) {

      window.plugins.Base64.encodeFile(results[0], function(base64){
        cBase64 = base64;
      });



    }, function(error) {

    });
    $scope.myprofil = function(base64) {
      var check;
      check = UserService.getUser('user');

      $.ajax({
        url: 'http://192.168.0.105:1337/myprofil/myprofil',
        crossDomain: true,
        type: 'post',
        dataType: 'json',
        data: 
        {
          userid: check.id,
          image: cBase64,
          description : $scope.loginData.descriptions,

        },
        success: function(data) {

        }
      });


    };
  };

})
.controller('LikeCtrl', function($scope, UserService, $location, $ionicHistory) {
  $scope.$on("$ionicView.beforeEnter", function(event, data){
   var check = UserService.getUser('user');
   if (check.connexion === undefined || check.connexion === null) {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $location.path('/app/login');
  }


  check = UserService.getUser('user');


  $.ajax({
    url: 'http://192.168.0.105:1337/like/like',
    crossDomain: true,
    type: 'post',
    dataType: 'json',
    data: 
    {
      userid: check.id,
    },
    success: function(data) {
      $scope.likes = data.like;
    }
  });

});


})
.controller('DislikeCtrl', function($scope, UserService, $location, $ionicHistory) {
  $scope.$on("$ionicView.beforeEnter", function(event, data){
   var check = UserService.getUser('user');
   if (check.connexion === undefined || check.connexion === null) {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $location.path('/app/login');
  }


  check = UserService.getUser('user');

  $.ajax({
    url: 'http://192.168.0.105:1337/like/dislike',
    crossDomain: true,
    type: 'post',
    dataType: 'json',
    data: 
    {
      userid: check.id,
    },
    success: function(data) {
      $scope.dislike = data.like;
    }
  });
});

});
