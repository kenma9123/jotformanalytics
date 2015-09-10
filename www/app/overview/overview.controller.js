angular.module('overview.controller', [
  'lodash.service',
  'stats.service'
])

.controller('OverviewCtrl', [
  '$scope', '_', 'StatsService', 'numberFormatFilter',
  function($scope, _, StatsService, numberFormatFilter) {
    console.log(StatsService.getAggregatedResults());

    var startDate = moment().subtract(1, 'weeks');
    var endDate = moment();

    $scope.formviews = numberFormatFilter(StatsService.getViewsDeviceDistributionBetween(startDate, endDate).total);
    $scope.infolist = [{
      name: 'Responses',
      value: numberFormatFilter(StatsService.getSubmissionsDeviceDistributionBetween(startDate, endDate).total),
      color: 'red',
      icon: 'ion-reply'
    }, {
      name: 'Conversion Rate',
      value: numberFormatFilter(StatsService.getTotalConversionRate(startDate, endDate)) + '%',
      color: 'orange',
      icon: 'ion-ios-pulse-strong'
    }, {
      name: 'Average Time',
      value: StatsService.getTotalAverageTime(startDate, endDate).toString().toHHMMSS(),
      color: 'blue',
      icon: 'ion-android-time'
    }];
  }
])
