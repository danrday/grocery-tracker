// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ngCordova', 'ngFileUpload', 'ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
  .state('inside', {
    url: '/inside',
    templateUrl: 'templates/inside.html',
    controller: 'InsideCtrl'
  })
  .state('inside.newShoppingTrip', {
   url: '/newShoppingTrip',
   views: {
         // the main template will be placed here (relatively named)
         '': { templateUrl: 'templates/newShoppingTrip/index.html', controller: 'newShoppingTripCtrl' }
        //  ,
        //  // embedded charts
        //  'scanUPC@inside.newShoppingTrip': {
        //      templateUrl: 'templates/newShoppingTrip/scanUPC.html'
        //  }
        //  ,
        //  'scanReceipt@inside.newShoppingTrip': {
        //      templateUrl: 'templates/newShoppingTrip/scanReceipt.html',
        //      controller: 'PictureCtrl'
        //  }
       }
     })
   .state('inside.scanUPC', {
     url: '/scanUPC',
     templateUrl: 'templates/newShoppingTrip/scanUPC.html'
   })
   .state('inside.scanReceipt', {
     url: '/scanReceipt',
     templateUrl: 'templates/newShoppingTrip/scanReceipt.html',
     controller: 'PictureCtrl'
   })
   .state('inside.enterLocation', {
     url: '/enterLocation',
     templateUrl: 'templates/newShoppingTrip/enterLocation.html',
     controller: 'LocationCtrl'
   })
   .state('inside.taxAndTotal', {
     url: '/taxAndTotal',
     templateUrl: 'templates/newShoppingTrip/taxAndTotal.html',
     controller: 'TotalCtrl'
   })
   .state('inside.purchasedProduct', {
     url: '/purchasedProduct',
     templateUrl: 'templates/newShoppingTrip/purchasedProduct.html',
     controller: 'PurchasedProductCtrl'
   })
   .state('inside.categories', {
     url: '/categories',
     templateUrl: 'templates/newShoppingTrip/categories.html',
     controller: 'CategoriesCtrl'
   })
   .state('inside.showResults', {
     url: '/showResults',
     templateUrl: 'templates/newShoppingTrip/showResults.html',
     controller: 'ResultsCtrl'
   })
       ;
 //   templateUrl: "templates/newShoppingTrip/index.html"
 // })
 //   .state('inside.newShoppingTrip.scanUPC', {
 //    url: '/scanUPC',
 //    templateUrl: "templates/newShoppingTrip/scanUPC.html"
 //  })
 //  .state('inside.newShoppingTrip.scanReceipt', {
 //   url: '/scanReceipt',
 //   templateUrl: "templates/newShoppingTrip/scanReceipt.html"
  // })
 // ;

  $urlRouterProvider.otherwise('/outside/login');
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});
