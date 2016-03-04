app.factory('OrderFactory', function($http) {

	var fetchAll = function() {
		return $http.get('/api/orders')
			.then(res => res.data);
	};

	return {
		fetchAll: fetchAll
	};
});