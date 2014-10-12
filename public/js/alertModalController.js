// Alert Modal Controller

function AlertModalController(
	$scope, $modalInstance, alertService
) {
	$scope.alerts = alertService.alerts;
	
	$scope.closeAlert = function(index) {
		alertService.closeAlert(index);
		if (alertService.alerts.length == 0) {
			$modalInstance.close();
		}
	}

	$scope.ok = function () {
		$modalInstance.close();
	};

}

