//TODO Detect when the server side hasn't finished loading all songs. Display an appropriate message.

function ArtistChartController(
	$scope,$filter,$http,$modal,alertService,_resources
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

	//TODO Make this a resource.
	function getPage(fullname,config,callback) {
		$http.get('page/'+fullname,config)
			.success(callback)
			.error(function(data,status,headers,config) {
				alertService.addAlert({
					"title": "Failure to Get Page Data",
					"message": "The call to page/"+fullname+" failed to return data.",
					"data": data, 
					'status':status, 
					'headers':headers, 
					'config':config 
				});
				$scope.showAlertIcon = true;
			})
		;
	}
	
	function getArtistChartData(reload)  {
		$scope.showSpinner = true;
		$scope.displayArray = [];
		$scope.dataParameters.reload = reload;

		console.log('getArtistChartData',$scope.dataParameters);
		
		$scope.displayArray = _resources.artists.query(
			$scope.dataParameters,
			function(content, responseHeaders) { // success callback
				console.log('content',content); //TEMP
				angular.forEach(content, function(entity) {
					config = { 
						cache: true, // use default cache
					}; 
					getPage(
						entity.slug,
						config,
						function(data,status,headers,config) {
							console.log('getPage: data',data); //TEMP
							data = data[0];
							if (!data) {
								name = 'data NULL';
							} else if (!data.title) {
								name = 'data.title NULL';
							} else {
								name = data.title;
							}
							entity.artistObject = {
								'name' : name
							};
						}
					);
				})				
				$scope.showSpinner = false;
			},
			function(httpResponse) { // error callback
				alertService.addAlert({
					"title": "Failure to Get Artist Chart Data",
					"message": "The call to artist resource failed to return data.",
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
