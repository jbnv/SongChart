function SongChartController($scope,$filter,dataService) {

	var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
	
	$scope.init = function() {
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
	
	function massageScoreEntries() {
		for (var index in $scope.displayArray) {
			dataService.massageScoreEntry($scope.displayArray[index],parseInt(index)+1);
		}
	}
	
	$scope.defaultMode = function()  {
		$scope.displayArray = angular.copy(dataService.scoreData);
		$scope.displayArray = $filter('orderBy')($scope.displayArray, ['year','month','-score']);
		massageScoreEntries();
		$scope.showRank = false;
		$scope.showDate = true;
    };
	
	$scope.monthMode = function(y,m)  {
		$scope.displayArray = $filter('filter')(dataService.scoreData, {'year':y,'month':m});
		$scope.displayArray = $filter('orderBy')($scope.displayArray, ['-score']);
		massageScoreEntries();
		$scope.showRank = true;
		$scope.showDate = false;
    };

	$scope.yearMode = function(y)  {
		extract = $filter('filter')(dataService.scoreData, {'year':y});
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
		massageScoreEntries();
		$scope.showRank = true;
		$scope.showDate = false;
    };
	
	$scope.init();
}
