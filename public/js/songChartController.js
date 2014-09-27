function SongChartController(
	$scope,$filter,$http
) {
	$scope.identity = angular.identity;

	$scope.months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		
	$scope.init = function() {
		$scope.filter = { decade: 0, year: 0, month: 0 };
		$scope.display = { decade: "Decade", year: "Year", month: "Month" };
	}

	$scope.setFilterDecade = function(d) {
		$scope.filter.decade = d;
		$scope.display.decade = ''+d+'s';
	}
	
	$scope.setFilterYear = function(y) {
		$scope.filter.year = y;
		$scope.display.year = y;
		$scope.display.month = '(Select Month)';
		getData();
	}

	$scope.setFilterMonth = function(m) {
		$scope.filter.month = m;
		$scope.display.month = $scope.months[m-1];
		getData();
	}
	

	
	$scope.dateString = function(scoreObject) {
		return scoreObject.year + '-' + ("00"+scoreObject.month).substr(-2,2);
	}
	
	function getArtist(songObject) {
		config = { 
			cache: true, // use default cache
		}; 
		$http.get('page/'+songObject.artist,config).then(function(result) {
			data = result.data[0];
			if (!data) {
				name = 'data NULL';
			} else if (!data.title) {
				name = 'data.title NULL';
			} else {
				name = data.title;
			}
			songObject.artistObject = {
				'name' : name
			};
		});
	}
			
	function getData()  {
		y = $scope.filter.year;
		m = $scope.filter.month;
		$scope.showRank = true;
		$scope.showDate = false;
		$scope.showIsDebut = m;
		$http.get('scores/'+y+(m?'/'+m:''))
			.then(function(result) {
				list = $filter('orderBy')(result.data, ['-score']);
				angular.forEach(list, getArtist);
				$scope.displayArray = list;
			})
    };
	
	$scope.reload = getData;
	
	$scope.init();
}
