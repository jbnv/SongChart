//TODO Detect when the server side hasn't finished loading all songs. Display an appropriate message.

function SongChartController(
	$scope,$filter,$http,$modal
) {
	$scope.identity = angular.identity;

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

	$scope.setSort = function(predicate) {
		$scope.sortPredicate = predicate;
	}
	
	function columns() {
	
		this.rank = { 'title': 'Rank' };
		this.title = { 'title': 'Title' };
		this.artist = { 'title': "Artist" };
		this.score = { 'title': 'Score' };
		this.projectedRank = { 'title': "Projected Rank" };
		this.debutDate = { 'title': "Debut Date" };
		this.debutRank = { 'title': "Debut Rank" };
		this.peakRank = { 'title': "Peak Rank" };
		this.duration = { 'title': "Duration (Months)" };
		this.k = { 'title': "Coefficient Constant" };
		this.a = { 'title': "Ascent Coefficient" };
		this.b = { 'title': "Descent Coefficient" };
		this.timeToPeak = { 'title': "Time to Peak" };
		
		this.show = function(slug) {
			this[slug].hidden = false;
		}

		this.hide = function(slug) {
			this[slug].hidden = true;
		}
	
	}
		
	$scope.columns = new columns();
	
	$scope.dateString = function(scoreObject) {
		return scoreObject.year + '-' + ("00"+scoreObject.month).substr(-2,2);
	}
	
	function getArtist(songObject) {
		$scope.showSpinner = true;
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
			$scope.showSpinner = false;
		});
	}
			
	function getData()  {
		$scope.showSpinner = true;
		y = $scope.filter.year;
		m = $scope.filter.month;
		$scope.columns.show('rank');
		$scope.columns.hide('debutDate');
		if (m) {
			$scope.showIsDebut = true;
			$scope.columns.show('projectedRank');
			$scope.columns.hide('score');
			sortField = 'projectedRank';
		} else {
			$scope.showIsDebut = false;
			$scope.columns.hide('projectedRank');
			$scope.columns.show('score');
			sortField = '-score';
		}
		$http.get('scores/'+y+(m?'/'+m:''))
			.then(function(result) {
				list = $filter('orderBy')(result.data, [sortField]);
				for (var index in list) {
					song = list[index];
					song.rank = parseInt(index)+1;
					getArtist(song);
				}
				$scope.displayArray = list;
				$scope.showSpinner = false;
			})
    };
	
	$scope.reload = getData;

	// If n not set, limit = all.
	$scope.setCountLimit = function(n) {
		oldCountLimit = $scope.countLimit;
		$scope.countLimit = n;
		//TODO Alter the listing as needed.
		//TODO Load additional entries if needed.
/*		if ($scope.countLimit > $scope.displayArray.length) {
			alertService.addAlert({
				"title": "Download Song List Again",
			});
		}
*/	}
	
	$scope.openSongModal = function (song) {
		var modalInstance = $modal.open({
			templateUrl: 'songModal.html',
			controller: 'songModalController',
			size: '',
			resolve: {
				song: function () {
					return song;
				}
			}
		});
	};

	$scope.init();
}
