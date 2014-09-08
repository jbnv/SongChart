songChartApp.controller('songChartController', ['$scope', '$filter', function($scope, $filter) {

	var apikey = "r0JF5IqvvWXmr3JRulYGNE0qd4BKeiMN";
	
	var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

/*	// Get all of the pages from playlists in the 'score' category.
	scorePageList = jsAPI(
		"pages.select",
		{"site": "playlists", "categories": ["score"]},
		apikey
	); // returns array of page names
	$scope.scoreObjectArray = [];
	for (var page in scorePageList) {
		// Get the particular page.
		wdPageObject = jsAPI(
			"pages.get_one",
			{"site": "playlists", "page": page},
			apikey
		);
		// Extract the pertinent form data.
		// parent = song
		scoreObject = {};
		scoreObject.song = wdPageObject.parent_fullname; //TODO Get song information and artist name.
		scoreObject.date = wdPageObject.date;
		scoreObject.score = wdPageObject.score;
		$scope.scoreObjectArray.push(scoreObject);
	}
*/	
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
	}

	$scope.setFilterMonth = function(m) {
		$scope.filterMonthValue = m;
		$scope.filterMonthDisplay = months[m-1];
	}
	
	$scope.dateString = function(scoreObject) {
		return scoreObject.year + '-' + ("00"+scoreObject.month).substr(-2,2);
	}
	
	$scope.defaultMode = function()  {
		$scope.displayArray = angular.copy($scope.scoreObjectArray);
		$scope.displayArray = $filter('orderBy')($scope.displayArray, ['year','month','-score']);
    };
	
	$scope.init();
}]);
