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

	// $scope.createDropdownItems = function(order) {
	// 	var possibleItems = {
	// 		Created: ["Processing"],
	// 		Processing: ["Cancelled", "Completed"],
	// 		Cancelled: [],
	// 		Completed: []
	// 	}
	// 	console.log(possibleItems[order.orderStatus])

	// 	return possibleItems[order.orderStatus];
	// };

  // $scope.status = {
  //   isopen: false
  // };

  // $scope.toggleDropdown = function($event) {
  //   $event.preventDefault();
  //   $event.stopPropagation();
  //   $scope.status.isopen = !$scope.status.isopen;
  // };

});