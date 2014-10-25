// Song Modal Controller

function SongModalController(
	$scope, $modalInstance, song
) {
	$scope.song = song;
	$scope.identity = angular.identity;
	
	$scope.ok = function () {
		$modalInstance.close();
	};
	
	$scope.pivot = function(pointRanks) {
		returnValue = [];
		for (index in pointRanks) {
			if (index % 4 == 0) {
				month = [];
				returnValue.push(month);
			}
			month.push(pointRanks[index]);
		}
		console.log('pivot',returnValue);
		return returnValue;
	}

}
