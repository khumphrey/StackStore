app.controller('OrderManagementCtrl', function($scope, orders) {
	$scope.orders = orders;
	$scope.availableOptions = [
		{value: 'All', name: 'Show All'},
		{value: 'Created', name: 'Created'},
		{value: 'Processing', name: 'Processing'},
		{value: 'Completed', name: 'Completed'},
		{value: 'Cancelled', name: 'Cancelled'}
	]
	$scope.filteredStatus = "All";

	$scope.ordersFilter = function(order) {
		if ($scope.filteredStatus === "All") return true;
		else return order.orderStatus === $scope.filteredStatus;
	}
	
});