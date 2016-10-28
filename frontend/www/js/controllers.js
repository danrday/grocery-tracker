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
.controller('PictureCtrl', function($scope, Upload, $cordovaCamera, $state) {
  console.log("PICTURE CONTROLLER")

  $scope.image= "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"

  let image;
  let imageTextToUpload;

//   let loadPic = function () {
//
//     $scope.image = image
//
//     Upload.upload({
//         url: 'http://10.0.0.143:8080/api/ocr',
//         file: imageTextToUpload,
//         fileName: "file"
//     }).progress(function (evt) {
//         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//         console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//     }).success(function (data, status, headers, config) {
//         console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
//     }).error(function (reply, status, headers) {
//     console.log("errrrrror:", reply);
//     console.log("errrrrror:", status);
//     console.log("errrrrror:", headers);
// });;
//   }

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
      $.post('http://10.0.0.143:8080/api/base64upload', _data, function(result) {

      console.log('result from server', result);

      //next up
      //$scope.parsedReceipt = result.text
      // $state.go('inside.parsedReceipt');

      });

   }, function(err) {
     // error
   });



                          // var options = {
                          //   encodingType: Camera.EncodingType.JPEG,
                          //   targetWidth: 50,
                          //   targetHeight: 50
                          // };

                          // $cordovaCamera.getPicture(options).then(function(imageData) {
                          //
                          //   // imageTextToUpload = imageData;
                          //   // image = imageData
                          //   console.log("IMAGE DATA", imageData)
                          //
                          //   resolveLocalFileSystemURL(imageData, function(fe) {
                          //     console.log("FE.FILE", fe.file)
                      	  // 			fe.file(function (file) {
                      	  // 				var f = new FileReader();
                      	  // 				f.readAsArrayBuffer(file);
                      	  // 				f.onloadend = function () {
                      	  // 					var x = new XMLHttpRequest();
                      	  // 					// var user = userFactory.get()
                      	  // 					x.open('POST', 'http://10.0.0.143:8080/api/testupload/');
                          //           console.log('post section')
                      	  // 					x.addEventListener('load', function (e) {
                      	  // 						// var events = JSON.parse(e.target.responseText)
                      	  // 						// $scope.events = events
                      	  // 						// $scope.$apply()
                      	  // 					});
                      	  // 					//changed f.result to f
                          //           console.log('f.result', f.result)
                      	  // 					x.send(f.result);
                      	  // 				}
                      	  // 		})
                        	// })
                          //
                          //   // imageTextToUpload = "data:image/jpeg;base64," + imageData;
                          //   // image = "data:image/jpeg;base64," + imageData;
                          //
                          //   // loadPic()
                          //
                          //   // console.log("image type", typeof(image))
                          //   // console.log("image length", image.length)
                          //   // console.log("image:", image)
                          // }, function(err) {
                          //   // errorc
                          //   console.log('error', err)
                          // });

  }, false);




});;
