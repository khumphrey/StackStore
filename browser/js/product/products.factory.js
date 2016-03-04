app.factory('ProductsFactory', function ($http) {
	return {
		fetchAll: function () {
			return $http.get('/api/products')
			.then(products => products.data);
		},

		fetchById: function (id) {
			return $http.get('/api/products/' + id)
			.then(product => product.data);
		},

		editById: function (id, data) {
			return $http.put('/api/products/' + id, data)
			.then(product => product.data);
		},

		create: function (data) {
			return $http.post('/api/products')
			.then(product => product.data);
		},

		delete: function(id) {
			return $http.delete('/api/products/' + id);
		}

	};
});