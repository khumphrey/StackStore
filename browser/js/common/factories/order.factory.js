app.factory('OrderFactory', function($http) {

	var fetchAll = function() {
		return $http.get('/api/orders')
			.then(res => res.data);
	};

	var changeOrderStatus = function(order, newStatus) {
		order.orderStatus = newStatus;
		return $http.put('/api/orders/' + order._id, order)
			.then(res => res.data);
	}

	var createOrder = function(order) {
		return $http.post('/api/orders', order)
			.then(res => res.data);
	}

	return {
		fetchAll: fetchAll,
		changeOrderStatus: changeOrderStatus,
		createOrder: createOrder
	};
});