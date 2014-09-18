function SongChartController(
	$scope,$filter,
	songService,scoreService,artistService
) {

	var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
	
	$scope.init = function() {
		$scope.filterYearValue = 0;
		$scope.filterYearDisplay = "Set Year";
		$scope.filterMonthValue = 0;
		$scope.filterMonthDisplay = "Set Month";
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
		
	function getData(dateString) {
		data = scoreService.getData(dateString);
		// data: An object { songId, score }
		$scope.displayArray = [];
		
		angular.forEach(data, function(score,songId) {
			song = songService.getSong(songId);
			artist = artistService.getArtist(song.artistSlug);
			this.push({ 'song': song, 'artist': artist, 'score': score, 'songId': songId });
		}, $scope.displayArray);
		
		$scope.displayArray = $filter('orderBy')($scope.displayArray, ['-score']);
		
		angular.forEach($scope.displayArray, function(entry,index) {
			entry.rank = parseInt(index)+1;
		});
		
	}
	
	$scope.monthMode = function(y,m)  {
		getData($scope.dateString({'year':y,'month':m}));
		$scope.showRank = true;
		$scope.showDate = false;
    };

	$scope.yearMode = function(y)  {
		getData(''+y);
		$scope.showRank = true;
		$scope.showDate = false;
    };
	
	$scope.init();
}
