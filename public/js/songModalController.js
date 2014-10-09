// Song Modal Controller

function SongModalController(
	$scope, $modalInstance, song
) {
	console.log(song);
	$scope.song = song;
	$scope.identity = angular.identity;
	
	$scope.ok = function () {
		$modalInstance.close();
	};

}
