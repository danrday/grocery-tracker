(function () {
    'use strict';

    angular.module('starter').controller('CameraCtrl', ['$cordovaCamera', '$scope', CameraCtrl]);

    console.log("CAMERA CONTROL")

    function CameraCtrl($cordovaCamera, $scope) {
        var vm = this;

        vm.takePicture = function () {
            var options = {
                quality : 100,
                destinationType : Camera.DestinationType.DATA_URL,
                //destinationType: Camera.DestinationType.FILE_URI,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
            //$cordovaCamera.getPicture(options).then(function (imageUri) {
                // Success! Image data is here
                vm.imgSrc = "data:image/jpeg;base64," + imageData;
                //vm.imgSrc = imageUri;

                // Now start image manipulation
                var canvasDom = document.getElementById("picCanvas");
                var canvas = canvasDom.getContext("2d");

                var img = new Image();
                img.src = "data:image/jpeg;base64," + imageData;
                //img.src = imageUri;

                img.onload = function () {
                    canvas.drawImage(img, 0, 0, 300, 300);

                //    //$scope.$apply();

                    canvas.fillStyle = "blue";
                    canvas.font = "bold 16px Arial";
                    canvas.fillText("Hello World!", 100, 100);
                };


            }, function (err) {
                alert("An error occured: " + err);
            });
        };

        vm.selectPicture = function () {
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            };

            $cordovaCamera.getPicture(options).then(function (imageUri) {
                // Success! Image data is here
                vm.imgSrc = imageUri;

            }, function (err) {
                alert("An error occured: " + err);
            });
        };
    };
})();




// angular.module('starter')
// .controller('CameraCtrl', ['$cordovaCamera', '$scope', CameraCtrl]);
//
// function CameraCtrl($cordovaCamera, $scope) {
//     var vm = this;
//
//     vm.takePicture = function () {
//         var options = {
//             quality : 75,
//             destinationType : Camera.DestinationType.DATA_URL,
//             sourceType : Camera.PictureSourceType.CAMERA,
//             allowEdit : true,
//             encodingType: Camera.EncodingType.JPEG,
//             targetWidth: 300,
//             targetHeight: 300,
//             popoverOptions: CameraPopoverOptions,
//             saveToPhotoAlbum: false
//         };
//
//         $cordovaCamera.getPicture(options).then(function (imageData) {
//             // Success! Image data is here
//             vm.imgSrc = "data:image/jpeg;base64," + imageData;
//         }, function (err) {
//             alert("An error occured: " + err);
//         });
//     };
//
//     vm.selectPicture = function () {
//         var options = {
//             destinationType: Camera.DestinationType.FILE_URI,
//             sourceType: Camera.PictureSourceType.PHOTOLIBRARY
//         };
//
//         $cordovaCamera.getPicture(options).then(function (imageUri) {
//             // Success! Image data is here
//             vm.imgSrc = imageUri;
//
//         }, function (err) {
//             alert("An error occured: " + err);
//         });
//     };
// };
