//TODO Detect when the server side hasn't finished loading all songs. Display an appropriate message.

function SongChartController(
	$scope,$filter,$http,$modal,
	alertService,_artistService,_resources
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
				decade: "Main Menu", year: "Year", month: "Month" 
			};
			return;
		} else if (p.topByPeak) {
			$scope.resultTitle = 'Top Songs by Peak Position';
			$scope.dataParameters = { 'sortField':'-peakRank', 'top':100 };
			$scope.columns.show('rank','score');
			$scope.columns.hide('debutDate','projectedRank');
			//TODO 
		} else if (p.topByDebut) {
			$scope.resultTitle = 'Top Songs by Debut Position';
			$scope.dataParameters = { 'sortField':'-debutRank', 'top':100 };
			$scope.columns.show('rank','score');
			$scope.columns.hide('debutDate','projectedRank');
			//TODO 
		} else if (p.topByDuration) {
			$scope.resultTitle = 'Top Songs by Longevity';
			$scope.dataParameters = { 'sortField':'-duration', 'top':100 };
			$scope.columns.show('rank','score');
			$scope.columns.hide('debutDate','projectedRank');
			//TODO 
		} else if (p.artist) {
			//TODO 
		} else if (p.decade) {
			$scope.resultTitle = p.decade+'s';
			$scope.filter = { 
				decade: p.decade, year: 0, month: 0, limit: 100
			};
			$scope.display = { 
				decade: (p.decade ? ''+p.decade+'s' : "Decade"), year: "Year", month: "Month" 
			};
			$scope.columns.show('rank');
			$scope.columns.hide('debutDate');
			$scope.columns.hide('projectedRank');
			$scope.columns.show('score');
			$scope.showIsDebut = false;
			$scope.dataParameters = { 'decade': p.decade, 'sortField':'-score' }; //TODO add refresh
			getSongChartData(); //TODO add refresh
		} else if (p.year) {
			p.decade = p.year - p.year%10;
			$scope.filter = { 
				decade: p.decade, year: p.year, month: p.month
			};
			$scope.display = { 
				decade: ''+p.decade+'s', year: ''+p.year, month: p.month ? $scope.months[p.month-1] : 'Select Month' 
			};
			$scope.columns.show('rank');
			$scope.columns.hide('debutDate');
			$scope.dataParameters = { 'year': p.year }; //TODO add refresh
			if (p.month) {
				$scope.resultTitle = $scope.months[p.month-1]+' '+p.year;
				$scope.dataParameters.month = p.month;
				$scope.showIsDebut = true;
				$scope.columns.show('projectedRank');
				$scope.columns.hide('score');
				$scope.dataParameters.sortField = 'projectedRank';
			} else {
				$scope.resultTitle = p.year;
				$scope.showIsDebut = false;
				$scope.columns.hide('projectedRank');
				$scope.columns.show('score');
				$scope.dataParameters.sortField = '-score';
			}		
			getSongChartData(); //TODO add refresh
		} else {
			$scope.displayArray = [];
			$scope.resultTitle = '(Invalid or null filter)';
			return;
		}
		
	}

	$scope.setSort = function(predicate) {
		$scope.sortPredicate = predicate;
	}
	
	$scope.columns = new Columns({
		'rank': 'Rank',
		'title': 'Title',
		'artist': "Artist",
		'score': 'Score',
		'projectedRank': "Projected Rank",
		'debutDate': "Debut Date",
		'debutRank': "Debut Rank",
		'peakRank': "Peak Rank",
		'duration': "Duration (Months)",
		'k': "Coefficient Constant",
		'a': "Ascent Coefficient",
		'b': "Descent Coefficient",
		'timeToPeak': "Time to Peak"
	});
	$scope.columns.timeToPeak.hidden = true;
		
	$scope.dateString = function(scoreObject) {
		return scoreObject.year + '-' + ("00"+scoreObject.month).substr(-2,2);
	}

	function addAlert(path,title,request) {
		return function(httpResponse) {
			alertService.addResourceAlert(path,title,request,httpResponse);
			$scope.showAlertIcon = true;
		};
	}
		
	//TODO Add refresh parameter, which will be set by refresh button.
	function getSongChartData()  {
		$scope.showSpinner = true;
		
		$scope.displayArray = _resources.songs.query(
			$scope.dataParameters,
			function(content, responseHeaders) { // success callback
				angular.forEach(content, function(song) {
					var request = { 'fullname': song.artist };
					var artistData = _resources.page.get(
						request,
						_artistService.bind(song), // returns success callback function
						addAlert('page/'+song.artist,"Artist Data",request) // returns error callback function
					);
					//TODO In month mode, check debut ranks on debut songs and mark if out of order.
				})
				$scope.showSpinner = false;
			},
			function(httpResponse) { // error callback
				alertService.addAlert({
					"title": "Failure to Get Data",
					"message": "The call to scores/"+y+(m?'/'+m:'')+" failed to return data.",
					"data": httpResponse.data, 
					'status':httpResponse.status, 
					'headers':httpResponse.headers, 
					'config':httpResponse.config 
				});
				$scope.showAlertIcon = true;
				$scope.showSpinner = false;
			}
		);
    };
	
	$scope.reload = getSongChartData; //TODO This needs to be generalized.

	// If n not set, limit = all.
	$scope.setCountLimit = function(n) {
		$scope.filter.limit = n;
	}
	
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

	$scope.openAlertModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'alertModal.html',
			controller: 'alertModalController',
			size: ''
		});
	};

	$scope.init();
}
