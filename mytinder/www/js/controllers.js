angular.module('starter.controllers', ['ionic', 'ionic.contrib.ui.tinderCards2'])


.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})
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
  }
})



.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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
      url: 'http://localhost:1337/login',
      crossDomain: true,
      type: 'post',
      dataType: 'json',
      data: {email: $scope.loginData.username, password: $scope.loginData.password},
      success: function(data) {
        console.log(data)
      }
       // beforeSend: setHeader
     })

    .done(function() {
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
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
.controller('RegisterCtrl', function($scope, $stateParams) {

 $scope.register = function(sexe) {

  if ($scope.loginData.password == $scope.loginData.passwordc) {
    $.ajax({
      url: 'http://localhost:1337/user/create',
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
        console.log(data)
      }
     })


  } else {
    console.log("error")
    $scope.errors = 'Les mots de passe ne corresponde pas.';
  }

}
})

.controller('ProfilCtrl', function($scope, $stateParams, TDCardDelegate, $timeout) {
  var cardTypes = [
  { image: 'img/chat1.jpg' },
  { image: 'http://c1.staticflickr.com/1/421/19046467146_548ed09e19_n.jpg' },
  { image: 'http://c1.staticflickr.com/1/278/18452005203_a3bd2d7938_n.jpg' },
  { image: 'http://c1.staticflickr.com/1/297/19072713565_be3113bc67_n.jpg' },
  { image: 'http://c1.staticflickr.com/1/536/19072713515_5961d52357_n.jpg' },
  { image: 'http://c4.staticflickr.com/4/3937/19072713775_156a560e09_n.jpg' },
  { image: 'http://c1.staticflickr.com/1/267/19067097362_14d8ed9389_n.jpg' }
  ];


  $scope.cards = {
    master: Array.prototype.slice.call(cardTypes, 0),
    active: Array.prototype.slice.call(cardTypes, 0),
    discards: [],
    liked: [],
    disliked: []
  }

  $scope.cardDestroyed = function(index) {
    $scope.cards.active.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[0];
    $scope.cards.active.push(angular.extend({}, newCard));
  }

  $scope.refreshCards = function() {
    // Set $scope.cards to null so that directive reloads
    $scope.cards.active = null;
    $timeout(function() {
      $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
    });
  }

  $scope.$on('removeCard', function(event, element, card) {
    var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
    $scope.cards.discards.push(discarded);
  });

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    var card = $scope.cards.active[index];
    $scope.cards.disliked.push(card);
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    var card = $scope.cards.active[index];
    $scope.cards.liked.push(card);
  };
})
.controller('CardCtrl', function($scope, TDCardDelegate) {

})

.controller('MessengerCtrl', function($scope, $timeout, $ionicScrollDelegate) {

  $scope.hideTime = true;

  var alternate,
    isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  $scope.sendMessage = function() {
    alternate = !alternate;
    console.log($scope.data.message)
    var d = new Date();
  d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    $scope.messages.push({
      userId: alternate ? '12345' : '54321',
      text: $scope.data.message,
      time: d
    });

    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);

  };


  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };


  $scope.data = {};
  $scope.myId = '12345';
  $scope.messages = [];

})

.controller('MyprofilCtrl', function($scope, $timeout) {


});