app.factory('CategoryFactory', function($http) {
	return {
		fetchAll: function() {
			return $http.get('/api/categories')
				.then(res => res.data);
		},
		addCategory: function (data) {
			return $http.post('/api/categories', data)
			.then(res => res.data);
		},
	};
});