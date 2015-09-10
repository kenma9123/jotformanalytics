(function(){

  angular.module('routes', [
    'home.controller',
    'overview.controller',

    'core.filters'
  ])

  .config([
    '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

      // for ios - tabs always at the bottom
      // for android - tabs always at the top
      // commenct out to position all tabs to top and center
      // $ionicConfigProvider.tabs.position('top');
      // $ionicConfigProvider.navBar.alignTitle('center');

      $stateProvider

      .state('home', {
        url: '/home',
        abstract: true,
        views: {
          'main': {
            templateUrl: 'app/home/index.html',
            controller: 'HomeCtrl'
          }
        }
      })

      .state('home.overview', {
        url: '/overview',
        views: {
          'maincontent': {
            templateUrl: 'app/overview/index.html',
            controller: 'OverviewCtrl',
          }
        },
        resolve: {
          'STATS': ['StatsService', function(StatsService){
            console.log('Fetch stats before running overview');
            return StatsService.fetch();
          }]
        }
      })

      // if none of the above states matched, use this as the fallback
      $urlRouterProvider.otherwise('/home/overview');
    }
  ]);

})();
