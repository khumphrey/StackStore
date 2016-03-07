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
<<<<<<< HEAD
		deleteCategory: function(category) {
			return $http.delete('/api/categories/' + category._id)
				.then(res => res.data);
		}
=======
>>>>>>> master
	};
});