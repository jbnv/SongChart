function SongChartController(
	$scope,$filter,$http
) {
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
		$scope.getData($scope.filterYearValue);
	}

	$scope.setFilterMonth = function(m) {
		$scope.filterMonthValue = m;
		$scope.filterMonthDisplay = $scope.months[m-1];
		$scope.getData($scope.filterYearValue,$scope.filterMonthValue);
	}
	

	
	$scope.dateString = function(scoreObject) {
		return scoreObject.year + '-' + ("00"+scoreObject.month).substr(-2,2);
	}
	
	var _artists = {};
	
	$scope.getArtist = function(id) {
		if (_artists[id]) {
			return _artists[id];
		} else {
			// Get it from the server and store it in the cache.
			return $http.get('page/'+id).then(function(result) {
				data = result.data[0];
				if (!data) {
					name = 'data NULL';
				} else if (!data.title) {
					name = 'data.title NULL';
				} else {
					name = data.title;
				}
				returnObject = {
					'name' : name
				}
				_artists[id] = returnObject;
				return returnObject;
			});
		} //if (_artists[id])
	}
			
	$scope.getData = function(y,m)  {
		$scope.showRank = true;
		$scope.showDate = false;
		$scope.showIsDebut = m;
		$http.get('scores/'+y+(m?'/'+m:''))
			.then(function(result) {
				$scope.displayArray = $filter('orderBy')(result.data, ['-score']);
			})
    };
	
	$scope.init();
}
