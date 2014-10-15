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
		getArtistChartData(); //TODO add refresh
	}
	
	$scope.setSort = function(predicate) {
		$scope.sortPredicate = predicate;
	}
	
	//TODO Extract column object to separate file.
	function columns() {
	
		this.rank = { 'title': 'Rank' };
		this.artistName = { 'title': "Name" };
		this.score = { 'title': 'Score' };
		
		this.show = function() { 
			for (var index in arguments) {
				this[arguments[index]].hidden = false;
			}
		}

		this.showOnly = function() { 
			var columnsToShow = [];
			for (var index in arguments) {
				columnsToShow.push(arguments[index]);
			}
			angular.forEach($scope.columns, function(column,key) {
				column.hidden = (columnsToShow.indexOf(key) == -1);
			})
		}

		this.hide = function(slug) {
			for (var index in arguments) {
				this[arguments[index]].hidden = true;
			}
		}
	
	}
		
	$scope.columns = new columns();

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
	
	function getArtistChartData()  {
		$scope.showSpinner = true;
		$scope.displayArray = [];

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
					//TODO In month mode, check debut ranks on debut songs and mark if out of order.
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
	
	$scope.reload = getArtistChartData;

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
