function SongChartController(
	$scope,$filter,$http,
	songService,scoreService,artistService
) {
	songService.$http = $http;
	artistService.$http = $http;

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
			$scope.displayArray.push({ 'score': score, 'songId': songId });
		});
		$scope.displayArray = $filter('orderBy')($scope.displayArray, ['-score']);
		
		angular.forEach($scope.displayArray, function(scoreObject,index) {
			songService.getSong('s:'+scoreObject.songId)
				.then(function(pSong) { scoreObject.song = pSong; })
				.then(function() {
					artistService.getArtist(scoreObject.song.artistSlug)
						.then(function(pArtist) {
							scoreObject.artist = pArtist;
						});
				});
		});
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
				$scope.displayArray = result.data;
			})
    };
	
	$scope.init();
}
