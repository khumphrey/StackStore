app.directive('orderAction', function(OrderFactory) {
	return {
		restrict: 'E',
		scope:{
			order: "="
		},
		templateUrl: '/js/admin/order-action.html',
		link: function(scope) {
			var possibleActions = {
				Created: ["Processing"],
				Processing: ["Cancelled", "Completed"],
				Cancelled: [],
				Completed: []
			}
			scope.actions = possibleActions[scope.order.orderStatus];

			scope.changeOrderStatus = function(newStatus) {
				// console.log("New Order Status is: ", newStatus);
				OrderFactory.changeOrderStatus(scope.order, newStatus);

			}
		}
	}
})