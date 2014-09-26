function SongChartController(
	$scope,$filter,$http,
	artistService
) {
	artistService.$http = $http;
	$scope.identity = angular.identity;

	$scope.months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	
	$scope.init = function() {
		$scope.filterDecadeValue = 0;
		$scope.filterDecadeDisplay = "Decade";
		$scope.filterYearValue = 0;
		$scope.filterYearDisplay = "Year";
		$scope.filterMonthValue = 0;
		$scope.filterMonthDisplay = "Month";
	}

	$scope.setFilterDecade = function(d) {
		$scope.filterDecadeValue = d;
		$scope.filterDecadeDisplay = ''+d+'s';
	}
	
	$scope.setFilterYear = function(y) {
		$scope.filterYearValue = y;
		$scope.filterYearDisplay = y;
		$scope.filterMonthValue = 0;
		$scope.filterMonthDisplay = '(Select Month)';
		$scope.yearMode($scope.filterYearValue);
	}

	$scope.setFilterMonth = function(m) {
		$scope.filterMonthValue = m;
		$scope.filterMonthDisplay = $scope.months[m-1];
		$scope.monthMode($scope.filterYearValue,$scope.filterMonthValue);
	}
	
	$scope.dateString = function(scoreObject) {
		return scoreObject.year + '-' + ("00"+scoreObject.month).substr(-2,2);
	}
		
	$scope.monthMode = function(y,m)  {
		getData($scope.dateString({'year':y,'month':m}));
		$scope.showRank = true;
		$scope.showDate = false;
    };

	$scope.yearMode = function(y)  {
		$scope.showRank = true;
		$scope.showDate = false;
		$http.get('scores/'+y)
			.then(function(result) {
				console.log(result);
				$scope.displayArray = $filter('orderBy')(result.data, ['-score']);
				angular.forEach($scope.displayArray, function(scoreObject,index) {
					artistService.getArtist(scoreObject.artist)
						.then(function(pArtist) {
							scoreObject.artist = pArtist;
						});
				});
			})
    };
	
	$scope.init();
}
