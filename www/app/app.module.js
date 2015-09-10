(function(){

  var APP_MODULE_NAME = 'jotformAnalytics';

  angular.module(APP_MODULE_NAME, ['ionic', 'routes'])

  .run([
    '$ionicPlatform', '$state',
    function($ionicPlatform, $state) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        // change status bar color
        // cordova statusbar plugin required
        if ( ionic.Platform.isAndroid() && window.StatusBar) {
          StatusBar.backgroundColorByHexString('#ffa500');
        }

        // initialize waves for click effects
        Waves.init();
      });
    }
  ])

  // bootstrap
  angular.element(document).ready(function() {
    angular.bootstrap(document, [APP_MODULE_NAME]);
  });

})();
