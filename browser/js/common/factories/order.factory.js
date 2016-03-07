app.factory('OrderFactory', function($http, $uibModal) {

	var availableFilters = ['Show All', 'Created', 'Processing', 'Completed', 'Cancelled'],
		currentFilter = availableFilters[0];

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

		getAvailableFilters: function () {
			return availableFilters;
		},

		getCurrentFilter: function () {
			return currentFilter;
		},

	    ordersFilter: function(order) {
	        if (currentFilter === "Show All") return true;
	        else return order.orderStatus === currentFilter;
	    },

	    setCurrentFilter: function (filter) {
	    	currentFilter = filter;
	    },

	    openOrderDetail: function(order) {
	        var modalInstance = $uibModal.open({
	            templateUrl: '/js/common/controllers/order.detail.html',
	            controller: 'OrderDetailCtrl',
	            size: 'lg',
	            resolve: {
	                order: function() {
	                    return order;
	                }
	            }
	        });
	    }
		
	};

});

