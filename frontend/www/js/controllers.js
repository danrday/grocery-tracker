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

.controller('InsideCtrl', function($scope, AuthService, UserNameService, API_ENDPOINT, $http, $state) {
  // $scope.destroySession = function() {
  //   AuthService.logout();
  // };

  $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
    $scope.memberinfo = result.data.msg;

    UserNameService.set(result.data.msg)

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
.controller('PictureCtrl', function($scope, Upload, $cordovaCamera, $state, ReceiptService, FinalReceiptService) {
  console.log("PICTURE CONTROLLER")

  $scope.image= "http://www.downgraf.com/wp-content/uploads/2014/09/01-progress.gif"

  FinalReceiptService.reset()

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

    finalReceipt.storeName = document.getElementById("storeName").value.toUpperCase()

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

    savedLocation.innerHTML = x.value.toUpperCase()

  }


})
.controller('TotalCtrl', function($scope, ReceiptService, FinalReceiptService, $state) {

  // let x = ReceiptService.get()
  // $scope.parsedReceipt = x
  // console.log("location control parsed:", x)
  //
  // let savedLocation = document.getElementById("location");
  //

  let x = ReceiptService.get()

  x = x.parsed

  console.log('x.parsed', x)

  x.forEach(function(line) {

    let y = line[0].toLowerCase()
    if (y.includes("tax") && line.length > 1) {
      console.log("TAX", line[1])
      document.getElementById("tax").value = line[1];
    } else if (y.includes("balance") || y.includes("purchase") && line.length > 1) {
      console.log("BALANCE", line[1])
      document.getElementById("total").value = line[1];
    }

  })

  //
  // for each(line in x) {
  //
  //   console.log("line", line)
  //   let y = line[0].toLowerCase()
  //   if (y.includes("tax") && line.length > 1) {
  //     console.log("TAX", line[1])
  //   } else if (y.includes("balance") || y.includes("purchase") && line.length > 1) {
  //     console.log("BALANCE", line[1])
  //   }
  // }


  $scope.saveContinue = function() {

    let finalReceipt = FinalReceiptService.get()

    finalReceipt.total = parseFloat(document.getElementById('total').value.trim())

    finalReceipt.tax = parseFloat(document.getElementById('tax').value.trim())

    finalReceipt.dateOfPurchase = new Date()

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
.controller('PurchasedProductCtrl', function($scope, $cordovaBarcodeScanner, ReceiptService, FinalReceiptService, $state) {

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

    let finalProduct = document.getElementById(`text-productID-${index}`).value.toUpperCase().trim();
    let finalPrice = document.getElementById(`text-price-${index}`).value.trim();

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
      price: parseFloat(finalPrice),
      memberSavings: parseFloat(xx),
      numberOfItems: parseFloat(yy),
      pricePerPound: parseFloat(zz)
    }

    // $state.go('inside.purchasedProduct');
  }

  let upcCode = null;

  $scope.scanUPC = function () {
    $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        console.log("barcode data:", barcodeData)
          document.getElementById('scanUPC').style.display = "none";
          upcCode = barcodeData.text
        // Success! Barcode data is here
      }, function(error) {
        // An error occurred
      });
  }

  $scope.delete = function(index) {
    document.getElementById(index).style.display = "none";
  }

  $scope.saveContinue = function() {

    //reset scanUPC
    document.getElementById('scanUPC').style.display = "block";

    //reset display
    document.getElementById("product").innerHTML = "";
    document.getElementById("price").innerHTML = "";
    document.getElementById("memberSavings").innerHTML = "";
    document.getElementById("numberOfItems").innerHTML = "";
    document.getElementById("pricePerPound").innerHTML = "";

    document.getElementById("saveContinue").disabled = true;

    document.getElementById(selectedIndex).style.display = "none";

    let finalReceipt = FinalReceiptService.get()

    newItem.upcCode = parseFloat(upcCode)

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


  $scope.done = function () {
    $state.go('inside.categories');
  }

})
.controller('CategoriesCtrl', function($scope, FinalReceiptService, $state) {

    $scope.showResults = function () {
      $state.go('inside.showResults');
    }

    let finalReceipt = FinalReceiptService.get()

    $scope.purchases = finalReceipt.purchases

    $scope.savedCategories = []

    $scope.save = function (index) {
      let cat = document.getElementById(`category-${index}`).value.trim()

      $scope.savedCategories[index] = cat

      let e = document.getElementById(`catOption-${index}`);

      console.log('e', e)
        console.log('e.options', e.options)

      let selectedOption = e.options[e.selectedIndex].value.trim();

      if (selectedOption !== "notSelected") {

        finalReceipt.purchases[index].category = selectedOption
      } else {
        finalReceipt.purchases[index].category = cat
      }

      document.getElementById(index).style.display = "none";

      FinalReceiptService.set(finalReceipt)

      let test = FinalReceiptService.get()

      console.log('finalReceipt!!', test)

    }

})
.controller('ResultsCtrl', function($scope, FinalReceiptService, $state) {

  let x = FinalReceiptService.get()

  // let zzz = JSON.stringify(x)
  //
  // console.log('json stringify', zzz)


// $.ajax('http://10.0.0.143:8080/api/testing'), {
//     method: 'POST',
//     data: {
//         name: newName
//     }
// })
// .then(
//     function success(data) {
//         console.log("success: " data)
//     },
//
//     function fail(data, status) {
//         alert('Request failed.  Returned status of ' + status);
//     }
// );

  console.log("results:", x)

  let zzz = JSON.stringify(x)




  // $.post('http://10.0.0.143:8080/api/testing', zzz, function(result) {
  //
  // console.log('result from server', result);
  //
  // });

  console.log('stringify', zzz)

  let purchases = x.purchases

  // let categories = []
  //
  // purchases.forEach(function(purchase){
  //   categories.push(purchase.category)
  // })
  //
  // categories = categories.sort()
  //
  // console.log("categories:", categories)
  //
  // let array_elements = categories

  // x.purchases = x.purchases.sort()

  function compare(a,b) {
  if (a.category < b.category)
    return -1;
  if (a.category > b.category)
    return 1;
  return 0;
}

x.purchases = x.purchases.sort(compare);

console.log('x.purchases', x.purchases)

let totalReceiptCost = 0;

let consolidatedCategories = []

//for d3 pie graph
let dataset = []


var legendColors = d3.scaleOrdinal(d3.schemeCategory10);


  var current = null;
    var cnt = 0;

    var cost = 0;

    for (var i = 0; i < x.purchases.length; i++) {

        if (x.purchases[i].category != current) {

            if (cnt > 0) {

                console.log(current + ' comes --> ' + cnt + ' times, with total cost' + cost);

                let thisCategory = {
                  category: current,
                  numTimes: cnt,
                  totalCost: cost.toFixed(2),
                  color: legendColors(i)
                }

                dataset.push({label: current, count: cost})

                consolidatedCategories.push(thisCategory)

            }

            current = x.purchases[i].category;

            cnt = 1;

            cost = x.purchases[i].price

            totalReceiptCost += cost

        } else {
            cnt++;

            cost += x.purchases[i].price

            totalReceiptCost += x.purchases[i].price

        }
    }

    if (cnt > 0) {
        console.log(current + ' comes --> ' + cnt + ' times, with total cost' + cost);

        let thisCategory = {
          category: current,
          numTimes: cnt,
          totalCost: cost.toFixed(2),
          color: legendColors(i)
        }

        consolidatedCategories.push(thisCategory)

        dataset.push({label: current, count: cost})

    }

    console.log("totalReceiptCost", totalReceiptCost)



    consolidatedCategories.forEach(function(category) {

      let percentOfTotal = ((category.totalCost / totalReceiptCost) * 100).toFixed(1)

      category.percentOfTotal = percentOfTotal
});

    console.log('consolidatedCategories', consolidatedCategories)


    function comparePercentOfTotal(a,b) {
      if (a.totalCost < b.totalCost)
        return -1;
      if (a.totalCost > b.totalCost)
        return 1;
      return 0;
    }

  consolidatedCategories = consolidatedCategories.sort(comparePercentOfTotal);


    $scope.results = consolidatedCategories



    // let dataset = [
    //   { label: 'Abulia', count: 10 },
    //   { label: 'Betelgeuse', count: 20 },
    //   { label: 'Cantaloupe', count: 30 },
    //   { label: 'Dijkstra', count: 40 }
    // ];




//
  // let array_elements = categories
  //
  // let eachElementListedOnce = {}
  //
  // var current = null;
  //   var cnt = 0;
  //
  //   for (var i = 0; i <= array_elements.length; i++) {
  //
  //       if (array_elements[i] != current) {
  //
  //           if (cnt > 0) {
  //
  //               console.log(current + ' comes --> ' + cnt + ' times<br>');
  //               eachElementListedOnce.current = cnt
  //
  //           }
  //
  //           current = array_elements[i];
  //           cnt = 1;
  //
  //       } else {
  //           cnt++;
  //       }
  //   }
    //
    // let eachCategory = Object.keys(eachElementListedOnce)
    //
    // for (i=0; i<eachCategory.length; i++) {
    //   for (i=0; i<eachCategory[i]; i++) {
    //
    //   }
    // }



    var width = 300;
    var height = 300;
    var radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    var arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    var pie = d3.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d) {
        return color(d.data.label);
      })



});;
