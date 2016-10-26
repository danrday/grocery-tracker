angular.module('starter')

.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };

  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('inside');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})

.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };

  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})

.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
  // $scope.destroySession = function() {
  //   AuthService.logout();
  // };

  $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
    $scope.memberinfo = result.data.msg;
  })

  // $scope.getInfo = function() {
  //   $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
  //     $scope.memberinfo = result.data.msg;
  //   });
  // };

  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
})

.controller('newShoppingTripCtrl', function($scope) {
  let date = new Date();
  date = date.toString()
  $scope.date = date
  console.log(date.toString())
})
.controller('PictureCtrl', function($scope, $cordovaCamera) {
  console.log("PICTURE CONTROLLER")

  $scope.image= "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"

  let image;

  let loadPic = function () {
    $scope.image = image
  }

  pictureTaken = false

  document.addEventListener("deviceready", function ($scope) {

    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      // targetWidth: 250,
      // targetHeight: 1500,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
	  correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log("TEST")
      pictureTaken = true

      image = "data:image/jpeg;base64," + imageData;
      loadPic()
      console.log("image type", typeof(image))
      console.log("image length", image.length)
    }, function(err) {
      // error
    });

  }, false);




});;
