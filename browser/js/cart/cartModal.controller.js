app.controller('cartModalCtrl', function ($scope, $uibModalInstance) {
	
	$scope.choice = function (option) {
		$uibModalInstance.close(option);
	}
})