songChartApp.controller('songChartController', ['$scope', '$filter', function($scope, $filter) {

	var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
	
	$scope.init = function() {
		$scope.songObjectArray = songData;
		$scope.scoreObjectArray = scoreData;
		$scope.filterYearValue = 0;
		$scope.filterYearDisplay = "Set Year";
		$scope.filterMonthValue = 0;
		$scope.filterMonthDisplay = "Set Month";
		$scope.defaultMode();
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
		$scope.filterMonthDisplay = months[m-1];
		$scope.monthMode($scope.filterYearValue,$scope.filterMonthValue);
	}
	
	$scope.dateString = function(scoreObject) {
		return scoreObject.year + '-' + ("00"+scoreObject.month).substr(-2,2);
	}
	
	$scope.defaultMode = function()  {
		$scope.displayArray = angular.copy($scope.scoreObjectArray);
		$scope.displayArray = $filter('orderBy')($scope.displayArray, ['year','month','-score']);
		$scope.showRank = false;
		$scope.showDate = true;
    };
	
	$scope.monthMode = function(y,m)  {
		$scope.displayArray = $filter('filter')($scope.scoreObjectArray, {'year':y,'month':m});
		$scope.displayArray = $filter('orderBy')($scope.displayArray, ['-score']);
		for (var index in $scope.displayArray) {
			$scope.displayArray[index].rank = parseInt(index)+1;
		}
		$scope.showRank = true;
		$scope.showDate = false;
    };

	$scope.yearMode = function(y)  {
		extract = $filter('filter')($scope.scoreObjectArray, {'year':y});
		collapse = {};
		// Collapse extract by songId.
		for (var index in extract) {
			that = extract[index];
			if (!collapse[that.songId]) collapse[that.songId] = 0;
			collapse[that.songId] += that.score;
		}
		// Transform collapse array into display array.
		$scope.displayArray = [];
		for (var songId in collapse) {
			score = collapse[songId];
			$scope.displayArray.push({ songId: songId, score: score });
		}
		$scope.displayArray = $filter('orderBy')($scope.displayArray, ['-score']);
		for (var index in $scope.displayArray) {
			$scope.displayArray[index].rank = parseInt(index)+1;
		}
		$scope.showRank = true;
		$scope.showDate = false;
    };

	
	$scope.init();
}]);
