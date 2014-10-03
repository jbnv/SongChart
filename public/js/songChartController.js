function SongChartController(
	$scope,$filter,$http
) {
	$scope.identity = angular.identity;
	$scope.formatScore = function(score) { return Math.floor(score*1000)/1000; };
	$scope.formatProjectedRank = function(score) { return Math.floor(score*10)/10; };

	$scope.months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		
	$scope.init = function() {
		$scope.setFilter();
	}
	
	$scope.setFilter = function(p) {
		if (!p) {
			$scope.filter = { 
				decade: 0, year: 0, month: 0 
			};
			$scope.display = { 
				decade: "Decade", year: "Year", month: "Month" 
			};
		} else //TODO p.artist
		if (p.decade) {
			$scope.filter = { 
				decade: p.decade, year: 0, month: 0 
			};
			$scope.display = { 
				decade: (p.decade ? ''+p.decade+'s' : "Decade"), year: "Year", month: "Month" 
			};
			//TODO getData() for decade;
			$scope.displayArray = [];
		} else if (p.year) {
			p.decade = p.year - p.year%10;
			$scope.filter = { 
				decade: p.decade, year: p.year, month: p.month
			};
			$scope.display = { 
				decade: ''+p.decade+'s', year: ''+p.year, month: p.month ? $scope.months[p.month-1] : 'Select Month' 
			};
			getData();
		} else {
			$scope.displayArray = [];
		}
	}
	
	$scope.dateString = function(scoreObject) {
		return scoreObject.year + '-' + ("00"+scoreObject.month).substr(-2,2);
	}
	
	function getArtist(songObject) {
		if (!songObject) return;
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
		$scope.showScore = !m;
		$scope.showProjectedRank = m;
		sortField = m ? 'projectedRank' : 'score';
		$http.get('scores/'+y+(m?'/'+m:''))
			.then(function(result) {
				list = $filter('orderBy')(result.data, [sortField]);
				angular.forEach(list, getArtist);
				$scope.displayArray = list;
			})
    };
	
	$scope.reload = getData;
	
	$scope.init();
}
