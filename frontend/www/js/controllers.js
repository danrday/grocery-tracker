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
      $.post('http://10.0.0.143:8080/api/base64upload', _data, function(result) {

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
.controller('LocationCtrl', function($scope, ReceiptService, FinalReceiptService, $state) {

  let x = ReceiptService.get()
  $scope.parsedReceipt = x
  console.log("location control parsed:", x)

  let savedLocation = document.getElementById("location");

  $scope.saveContinue = function() {

    let finalReceipt = FinalReceiptService.get()

    finalReceipt.location = savedLocation.innerHTML

    finalReceipt.location = finalReceipt.location.trim()

    console.log("finalReceipt", finalReceipt)

    FinalReceiptService.set(finalReceipt)

    $state.go('inside.taxAndTotal');

  }

  $scope.saveLocation = function(index) {

    document.getElementById("saveContinue").disabled = false;

    console.log("INDEX", index)
    let x = document.getElementById(index);

    console.log("x.value", x.value)

    savedLocation.innerHTML = x.value

  }


})
.controller('TotalCtrl', function($scope, ReceiptService, FinalReceiptService, $state) {

  // let x = ReceiptService.get()
  // $scope.parsedReceipt = x
  // console.log("location control parsed:", x)
  //
  // let savedLocation = document.getElementById("location");
  //
  $scope.saveContinue = function() {

    let finalReceipt = FinalReceiptService.get()

    finalReceipt.total = document.getElementById('total').value

    finalReceipt.tax = document.getElementById('tax').value
    //
    // finalReceipt.total = finalReceipt.total.trim()
    // finalReceipt.tax = finalReceipt.tax.trim()

    console.log("finalReceipt", finalReceipt)

    FinalReceiptService.set(finalReceipt)

    $state.go('inside.purchasedProduct');

  }
  //
  // $scope.saveLocation = function(index) {
  //
  //   document.getElementById("saveContinue").disabled = false;
  //
  //   console.log("INDEX", index)
  //   let x = document.getElementById(index);
  //
  //   console.log("x.value", x.value)
  //
  //   savedLocation.innerHTML = x.value
  //
  // }
})
.controller('PurchasedProductCtrl', function($scope, ReceiptService, FinalReceiptService, $state) {

  let x = ReceiptService.get()

  let onlyProductsWithPrices = []

  for (z in x.parsed ) {
    console.log("Z", z)

    let y = x.parsed[z]

    if (y.length !== 1) {
      onlyProductsWithPrices.push(y)
    }
  }

  $scope.parsedReceipt = onlyProductsWithPrices

  console.log("onlyproductswithprices", onlyProductsWithPrices)

  console.log("location control parsed:", x)


  //

  $scope.memberSavings = function (index) {

    let memberSavingsEl = document.getElementById(`memberSavings-${index}`);

    console.log('memberSavings', memberSavingsEl)

    let x = memberSavingsEl.style.display

    if (x === 'none' || x === '') {
      console.log('one')
      memberSavingsEl.style.display = 'inline-block'
    } else {
      console.log('two')
      memberSavingsEl.style.display = 'none'
    }

    console.log('memberSavings', memberSavingsEl.style.display)

    // toggleOption.toggle()

  };
  $scope.numberOfItems = function (index) {

    let numberOfItems = document.getElementById(`numberOfItems-${index}`);

    console.log('numberOfItems', numberOfItems)

    let x = numberOfItems.style.display

    if (x === 'none' || x === '') {
      console.log('one')
      numberOfItems.style.display = 'inline-block'
    } else {
      console.log('two')
      numberOfItems.style.display = 'none'
    }

  };
  $scope.pricePerPound = function (index) {
    let pricePerPound = document.getElementById(`pricePerPound-${index}`);

    console.log('pricePerPound', pricePerPound)

    let x = pricePerPound.style.display

    if (x === 'none' || x === '') {
      console.log('one')
      pricePerPound.style.display = 'inline-block'
    } else {
      console.log('two')
      pricePerPound.style.display = 'none'
    }

  };
  $scope.scanUPC = function () {};
  $scope.scanUPC = function () {};

  let newItem = {}

  let selectedIndex;

  $scope.selectTextFields = function(index) {

    selectedIndex = index

    document.getElementById("saveContinue").disabled = false;

    console.log("INDEX", index)
    // let x = document.getElementById(index);

    let product = document.getElementById('product');
    let price = document.getElementById('price');
    let memberSavings = document.getElementById('memberSavings');
    let numberOfItems = document.getElementById('numberOfItems');
    let pricePerPound = document.getElementById('pricePerPound');

    let finalProduct = document.getElementById(`text-productID-${index}`).value;
    let finalPrice = document.getElementById(`text-price-${index}`).value;

    product.innerHTML = 'Product:' + finalProduct
    price.innerHTML = 'Price:' + finalPrice

    console.log("VALUE", document.getElementById(`text-memberSavings-${index}`).value)

    let xx = document.getElementById(`text-memberSavings-${index}`).value
    let yy = document.getElementById(`text-numberOfItems-${index}`).value
    let zz = document.getElementById(`text-pricePerPound-${index}`).value
    xx = xx.trim()
    yy = yy.trim()
    zz = zz.trim()

    if (xx.length !== 0) {
      memberSavings.innerHTML = 'Member Savings: ' + document.getElementById(`text-memberSavings-${index}`).value;
    }

    if (yy.length !== 0) {
      numberOfItems.innerHTML = '# items: ' + document.getElementById(`text-numberOfItems-${index}`).value;
    }

    if (zz.length !== 0) {
        pricePerPound.innerHTML = 'Price per lb: ' + document.getElementById(`text-pricePerPound-${index}`).value;
    }

    newItem = {
      product: finalProduct,
      price: finalPrice,
      memberSavings: xx,
      numberOfItems: yy,
      pricePerPound: zz
    }

    // $state.go('inside.purchasedProduct');
  }


  $scope.delete = function(index) {
    document.getElementById(index).style.display = "none";
  }

  $scope.saveContinue = function() {

    document.getElementById("product").innerHTML = "";
    document.getElementById("price").innerHTML = "";
    document.getElementById("memberSavings").innerHTML = "";
    document.getElementById("numberOfItems").innerHTML = "";
    document.getElementById("pricePerPound").innerHTML = "";

    document.getElementById("saveContinue").disabled = true;

    document.getElementById(selectedIndex).style.display = "none";

    let finalReceipt = FinalReceiptService.get()

    finalReceipt.purchases.push(newItem)
    //
    // finalReceipt.location = savedLocation.innerHTML
    //
    // finalReceipt.location = finalReceipt.location.trim()
    //
    // console.log("finalReceipt", finalReceipt)
    //
    FinalReceiptService.set(finalReceipt)

    let test = FinalReceiptService.get()

    console.log('finalReceipt!!', test)

  }

  $scope.addProduct = function() {

    document.getElementById('text-productID-0').value = ""
    document.getElementById('text-price-0').value = ""
    document.getElementById('text-numberOfItems-0').value = ""
    document.getElementById('text-pricePerPound-0').value = ""
    document.getElementById('text-memberSavings-0').value = ""

    document.getElementById(0).style.display = "block";

  }

});;
