angular.module('starter')
.controller('CameraCtrl', ['$cordovaCamera', '$scope', CameraCtrl]);

function CameraCtrl($cordovaCamera, $scope) {
    var vm = this;

    vm.takePicture = function () {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            // Success! Image data is here
            vm.imgSrc = "data:image/jpeg;base64," + imageData;
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
