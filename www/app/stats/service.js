angular.module('stats.service', [
  'moment.service'
])

.service('StatsService', [
  '$http', '$q', 'moment',
  function($http, $q, moment) {
    var apiKey = '38149ecca79058d219ea468e3e2bcf67';

    var _from = Math.ceil(moment().subtract(1, 'weeks').valueOf() / 1000);
    var _until = Math.ceil(moment().valueOf() / 1000);

    var statsUrl = 'https://api.jotform.com/form/50133806587962/stats?from='+_from+'&until='+_until+'&apiKey=' + apiKey;
    // var statsUrl = 'test/stats.json';

    var allstats = {};

    this.fetch = fetch;
    this.getStats = getStats;
    this.getDeviceDistribution = getDeviceDistribution;
    this.getAggregatedResults = getAggregatedResults;
    this.getViewsDeviceDistributionBetween = getViewsDeviceDistributionBetween;
    this.getSubmissionsDeviceDistributionBetween = getSubmissionsDeviceDistributionBetween;
    this.getTotalConversionRate = getTotalConversionRate;
    this.getTotalAverageTime = getTotalAverageTime;

    /**
     * Fetch stats from server
     */
    function fetch() {
      if ( !angular.equals({}, allstats) ) {
        console.log('Cached version of stats');
        return $q(function(resolve){
          resolve(allstats);
        });
      }

      return $http.get(statsUrl).then(function(response){
        return setStats(response.data.content);
      });
    }

    /**
     * Set stats
     */
    function setStats(stats) {
      allstats = stats;
    }

    /**
     * Get stats
     */
    function getStats() {
      return allstats;
    }

    function getDeviceDistribution(key, start, end) {
      var total = 0,
        desktop = 0,
        tablet = 0,
        mobile = 0;

      _.each(allstats, function(s) {
        var d = moment.unix(s.timestamp);
        if ( d.isAfter(start) && d.isBefore(end) ) {
          if ( s.stats ) {
            if ( s.stats.desktop ) {
              total += Math.abs(s.stats.desktop[key]) || 0;
              desktop += Math.abs(s.stats.desktop[key]) || 0;
            }

            if ( s.stats.tablet ) {
              total += Math.abs(s.stats.tablet[key]) || 0;
              tablet += Math.abs(s.stats.tablet[key]) || 0;
            }

            if ( s.stats.mobile ) {
              total += Math.abs(s.stats.mobile[key]) || 0;
              mobile += Math.abs(s.stats.mobile[key]) || 0;
            }
          }
        }
      });

      return {
        total: total,
        desktop: Math.round(desktop / total * 100),
        tablet: Math.round(tablet / total * 100),
        mobile: Math.round(mobile / total * 100)
      };
    }

    function getAggregatedResults(start, end) {
      var desktopConversion = 0, tabletConversion = 0, mobileConversion=0, total = 0;
      var dViewCount = 0, dSubmissionCount = 0, dTimeSpent = 0;
      var mViewCount = 0, mSubmissionCount = 0, mTimeSpent = 0;
      var tViewCount = 0, tSubmissionCount = 0, tTimeSpent = 0;

      _.each(allstats, function(s) {
        var d = moment.unix(s.timestamp);
        // if ( d.isAfter(start) && d.isBefore(end) ) {
        if ( s.stats ) {
          if ( s.stats.desktop ) {
            dViewCount += s.stats.desktop.views || 0;
            dSubmissionCount += s.stats.desktop.submissions || 0;
            dTimeSpent += s.stats.desktop.timeSpent ? Math.abs(s.stats.desktop.timeSpent) : 0;
          }
          if ( s.stats.tablet ) {
            tViewCount += s.stats.tablet.views || 0;
            tSubmissionCount += s.stats.tablet.submissions || 0;
            tTimeSpent += s.stats.tablet.timeSpent ? Math.abs(s.stats.tablet.timeSpent) : 0;
          }
          if ( s.stats.mobile ) {
            mViewCount += s.stats.mobile.views || 0;
            mSubmissionCount += s.stats.mobile.submissions || 0;
            mTimeSpent += s.stats.mobile.timeSpent ? Math.abs(s.stats.mobile.timeSpent) : 0;
          }
        }
        // }
      });

      var result = {};
      result.totalViews = dViewCount + tViewCount + mViewCount;
      result.totalSubmissions = dSubmissionCount + mSubmissionCount + tSubmissionCount;
      result.totalConversion = !isNaN(result.totalSubmissions/result.totalViews) ? Math.round(result.totalSubmissions/result.totalViews*100) : 0;

      result.desktop = {};
      result.desktop.views = dViewCount;
      result.desktop.submissions = dSubmissionCount;
      result.desktop.conversion = !isNaN(dSubmissionCount/dViewCount) ? dSubmissionCount/dViewCount*100 : 0;
      result.desktop.name = 'Desktop';
      result.desktop.viewsPercentage = !isNaN(dViewCount/result.totalViews) ? dViewCount/result.totalViews*100 : 0;
      result.desktop.submissionsPercentage = !isNaN(dSubmissionCount/result.totalSubmissions) ? dSubmissionCount/result.totalSubmissions*100 : 0;
      result.desktop.avgTime = !isNaN(dTimeSpent/dSubmissionCount) ? dTimeSpent/dSubmissionCount : 0;

      result.tablet = {};
      result.tablet.views = tViewCount;
      result.tablet.submissions = tSubmissionCount;
      result.tablet.conversion = !isNaN(tSubmissionCount/tViewCount) ? tSubmissionCount/tViewCount*100 : 0;
      result.tablet.name = 'Tablet';
      result.tablet.viewsPercentage = !isNaN(tViewCount/result.totalViews) ? tViewCount/result.totalViews*100 : 0;
      result.tablet.submissionsPercentage = !isNaN(tSubmissionCount/result.totalSubmissions) ? tSubmissionCount/result.totalSubmissions*100 : 0;
      result.tablet.avgTime = !isNaN(tTimeSpent/tSubmissionCount) ? tTimeSpent/tSubmissionCount : 0;

      result.mobile = {};
      result.mobile.views = mViewCount;
      result.mobile.submissions = mSubmissionCount;
      result.mobile.conversion = !isNaN(mSubmissionCount/mViewCount) ? mSubmissionCount/mViewCount*100 : 0;
      result.mobile.name = 'Mobile';
      result.mobile.viewsPercentage = !isNaN(mViewCount/result.totalViews) ? mViewCount/result.totalViews*100 : 0;
      result.mobile.submissionsPercentage = !isNaN(mSubmissionCount/result.totalSubmissions) ? mSubmissionCount/result.totalSubmissions*100 : 0;
      result.mobile.avgTime = !isNaN(mTimeSpent/mSubmissionCount) ? mTimeSpent/mSubmissionCount : 0;

      return result;
    }

    function getSubmissionsDeviceDistributionBetween(start, end) {
      return getDeviceDistribution('submissions', start, end);
    }

    function getViewsDeviceDistributionBetween(start, end) {
      return getDeviceDistribution('views', start, end);
    }

    // function getListingValuesFor(start, end, domain, key) {
    //     var result = {};
    //     _.each(allstats, function(s) {
    //         var d = moment.unix(s.timestamp);
    //         // if(d.isAfter(start) && d.isBefore(end)) {
    //             if ( s.stats ) {
    //                 var values = s.stats[key];
    //                 _.each(_.keys(values), function(k){
    //                     var br = values[k];
    //                     if ( !result[k] ) {
    //                         result[k] = {
    //                             views: br.views || 0,
    //                             submissions: br.submissions || 0,
    //                             timeSpent: Math.abs(br.timeSpent) || 0,
    //                             name: k.replace(/MSIE/, "Internet Explorer "),
    //                         };
    //                     } else {
    //                         result[k].views += br.views || 0;
    //                         result[k].submissions += br.submissions || 0;
    //                         result[k].timeSpent += Math.abs(br.timeSpent) || 0;
    //                     }
    //                 });
    //             }
    //         // }
    //     });

    //     domain = domain || 'views';
    //     var total = 0;
    //     var displayFunction;
    //     switch(domain) {
    //         case 'Views':
    //             domain = 'views';
    //             total = this.getViewsDeviceDistributionBetween(start, end).total;
    //             displayFunction = function(){
    //                 this.value = this.views;
    //                 this.percentage = !isNaN(this.views/total) ? this.views/total*100 : 0;
    //             };
    //         break;
    //         case 'Responses':
    //             domain = 'submissions';
    //             total = this.getSubmissionsDeviceDistributionBetween(start, end).total;
    //             displayFunction = function(){
    //                 this.value = this.submissions;
    //                 this.percentage = !isNaN(this.submissions/total) ? this.submissions/total*100 : 0;
    //             };
    //         break;
    //         case 'Conversion Rate':
    //             domain = 'conversion';
    //             displayFunction = function(){
    //                 this.value = this.conversion;
    //             };
    //         break;
    //         case 'Avg. Time':
    //             domain = 'avgTime';
    //             displayFunction = function(){
    //                 this.value = this.avgTime;
    //             };
    //         break;
    //         default:
    //             displayFunction = function(){
    //                 this.value = this.views;
    //                 this.percentage = !isNaN(this.views/total) ? this.views/total*100 : 0;
    //             };
    //         break;
    //     }

    //     var sorted = [];
    //     _.each( result, function(r){
    //       var t = r.timeSpent / r.submissions;
    //       var c = r.submissions / r.views;
    //       r.avgTime = !isNaN(t) ? Math.round(t) : 0;
    //       r.conversion = !isNaN(c) ? c*100 : 0;
    //       displayFunction.call(r);
    //       if ( key === 'countries' ) {
    //             var country = _.find(countryCodes, function(c){return c.code == r.name});
    //             r.country = country ? country.name : r.name;
    //       }
    //       if(domain === 'views' || domain === 'submissions') {
    //         if(r.percentage > 0.05) {
    //           sorted.push(r);
    //         }
    //       } else {
    //         if(domain === 'conversion') {
    //           if(r.value > 0.05) {
    //             sorted.push(r);
    //           }
    //         } else if(domain === 'avgTime') {
    //           if(r.avgTime > 0) {
    //             sorted.push(r);
    //           }
    //         }
    //       }
    //     });

    //     var res = _.sortBy(sorted, function(s){return s[domain];}).reverse();
    //     return res;
    // }

    function getTotalConversionRate(start, end) {
      var totalSubmissions = getSubmissionsDeviceDistributionBetween(start, end).total;
      var totalView = getViewsDeviceDistributionBetween(start, end).total;
      var r = totalSubmissions / totalView * 100;

      if(isNaN(r)) {
        return 0;
      } else {
        return Math.round(r);
      }
    }

    function getTotalAverageTime(start, end) {
      var totalTimeSpent = getDeviceDistribution('timeSpent', start, end).total;
      var totalSubmissions = getSubmissionsDeviceDistributionBetween(start, end).total;
      var r = totalTimeSpent / totalSubmissions;

      if ( isNaN(r) ) {
        return 0;
      } else {
        return Math.round(r);
      }
    }

    /**
    * returns a stat item total value by iterating stats.desktop, stats.tablet and stats.mobile
    * @param  {String} key key existing in stats object
    * @return {int}     total value for given key
    */
    function getItemTotalByKey(item, key) {
      var res = 0;
      if ( item.stats ) {
        if ( item.stats.desktop ) {
          res += item.stats.desktop[key] || 0;
        }
        if ( item.stats.tablet) {
          res += item.stats.tablet[key] || 0;
        }
        if ( item.stats.mobile) {
          res += item.stats.mobile[key] || 0;
        }
      }
      return res;
    }
  }
])
