// Song Modal Controller

function SongModalController(
	$scope, $modalInstance, song
) {
	$scope.song = song;
	
	$scope.ok = function () {
		$modalInstance.close();
	};

}
