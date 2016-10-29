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
.controller('PictureCtrl', function($scope, Upload, $cordovaCamera, $state, ReceiptService) {
  console.log("PICTURE CONTROLLER")

  $scope.image= "http://www.downgraf.com/wp-content/uploads/2014/09/01-progress.gif"

  let image;
  let imageTextToUpload;

  document.addEventListener("deviceready", function ($scope) {

    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
	  correctOrientation:true
    };

   $cordovaCamera.getPicture(options).then(function(imageData) {

    //  var image = document.getElementById('myImage');

    //  let base64img = "data:image/jpeg;base64," + imageData;

     let base64img = imageData;

     console.log("base64img", base64img)

           let _data = {};
      // set test property:
      _data.avatar = base64img;
      console.log("data:", _data);
      // Make an Ajax request
      $.post('http://10.0.0.33:8080/api/base64upload', _data, function(result) {

      console.log('result from server', result);

      // $scope.parsedReceipt = result

      // console.log("scope.parsedReceipt", $scope.parsedReceipt)

      //next up
      ReceiptService.set(result)

      let x = ReceiptService.get()
      //
      console.log('ReceiptService:', x)

      $state.go('inside.enterLocation');

      });

   }, function(err) {
     // error
   });

  }, false);

})
.controller('LocationCtrl', function($scope, ReceiptService, FinalReceiptService) {

  let x = ReceiptService.get()
  $scope.parsedReceipt = x
  console.log("location control parsed:", x)

  let savedLocation = document.getElementById("location");

  $scope.saveContinue = function() {

    let finalReceipt = FinalReceiptService.get()

    finalReceipt.location = savedLocation.innerHTML

    console.log("finalReceipt", finalReceipt)

    FinalReceiptLocation.set(finalReceipt)

  }

  $scope.saveLocation = function(index) {

    document.getElementById("saveContinue").disabled = false;

    console.log("INDEX", index)
    let x = document.getElementById(index);

    console.log("x.value", x.value)

    savedLocation.innerHTML = x.value

  }




});;
