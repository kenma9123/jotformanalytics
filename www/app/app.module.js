(function(){

  var APP_MODULE_NAME = 'jotformAnalytics';

  angular.module(APP_MODULE_NAME, ['ionic'])

  .run(function($ionicPlatform) {
    // fires when the device is ready
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        var camelCase = 1;
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  // bootstrap
  angular.element(document).ready(function() {
    angular.bootstrap(document, [APP_MODULE_NAME]);
  });

})();