songChartApp.controller('songChartController', function ($scope) {

	var apikey = "r0JF5IqvvWXmr3JRulYGNE0qd4BKeiMN";

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
	$scope.songObjectArray = songData;
	$scope.scoreObjectArray = scoreData;

});
