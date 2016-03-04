app.controller('OrderManagementCtrl', function($scope, orders) {
	$scope.orders = orders;

	$scope.createDropdownItems = function(order) {
		var possibleItems = {
			Created: ["Processing"],
			Processing: ["Cancelled", "Completed"],
			Cancelled: [],
			Completed: []
		}
		console.log(possibleItems[order.orderStatus])

		return possibleItems[order.orderStatus];
	};

  $scope.status = {
    isopen: false
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

});