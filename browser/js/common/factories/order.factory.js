app.factory('OrderFactory', function($http) {
	return {
		fetchAll: function(queryStr) {
			queryStr = queryStr || "";
			return $http.get('/api/orders' + queryStr)
				.then(res => res.data);
		},

		changeOrderStatus: function(order, newStatus) {
			order.orderStatus = newStatus;
			return $http.put('/api/orders/' + order._id, order)
				.then(res => res.data);
		},

		createOrder: function(order) {
			return $http.post('/api/orders', order)
				.then(res => res.data);
		},

		availableFilters: ['Show All', 'Created', 'Processing', 'Completed', 'Cancelled'],

		

		
	};

});

    // $scope.ordersFilter = function(order) {
    //     if ($scope.currentFilter === "Show All") return true;
    //     else return order.orderStatus === $scope.currentFilter;
    // }

    // $scope.setCurrentFilter = function (filter) {
    // 	$scope.currentFilter = filter;
    // }

    // $scope.openOrderDetail = function(order) {
    //     var modalInstance = $uibModal.open({
    //         templateUrl: '/js/admin/order-detail.html',
    //         controller: 'OrderDetailCtrl',
    //         size: 'lg',
    //         resolve: {
    //             order: function() {
    //                 return order;
    //             }
    //         }
    //     });
    // }