//TODO Detect when the server side hasn't finished loading all songs. Display an appropriate message.

function ArtistChartController(
	$scope,$filter,$http,$modal,alertService,_artistService,_resources
) {
	$scope.identity = angular.identity;

	$scope.months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		
	$scope.init = function() {
		$scope.setFilter();
	}
	
	$scope.setFilter = function(p) {
		$scope.resultTitle = 'Top Artists';
		$scope.dataParameters = { 'list':'artists', 'sortField':'-score', 'top':100 }; 
		getArtistChartData(); 
	}
	
	$scope.setSort = function(predicate) {
		$scope.sortPredicate = predicate;
	}
	
	$scope.columns = new Columns({
		'rank'			: 'Rank',
		'artistName'	: "Name",
		'score'			: 'Score',
		'songCount'		: '# of Songs'
	});

	function addAlert(path,title,request) {
		return function(httpResponse) {
			alertService.addResourceAlert(path,title,request,httpResponse);
			$scope.showAlertIcon = true;
		};
	}
	
	function getArtistChartData(reload)  {
		$scope.showSpinner = true;
		$scope.displayArray = [];
		$scope.dataParameters.reload = reload;
		
		$scope.displayArray = _resources.artists.query(
			$scope.dataParameters,
			function(content, responseHeaders) { // success callback
				angular.forEach(content, function(entity) {
					var request = { 'fullname': entity.slug }
					var artistData = _resources.page.get(
						request,
						_artistService.bind(entity), // returns success callback function
						addAlert('page/'+entity.slug,"Artist Data",request) // returns error callback function
					);
				})	
				$scope.showSpinner = false;
			},
			function(httpResponse) { // error callback
				alertService.addResourceAlert('artists resource',"Chart Data")(httpResponse);
				$scope.showAlertIcon = true;
				$scope.showSpinner = false;
			}
		);
    };
	
	// If n not set, limit = all.
	$scope.setCountLimit = function(n) {
		$scope.filter.limit = n;
	}
	
	$scope.openAlertModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'alertModal.html',
			controller: 'alertModalController',
			size: ''
		});
	};

	$scope.init();
}
