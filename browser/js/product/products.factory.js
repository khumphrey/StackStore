app.factory('ProductsFactory', function ($http) {
	return {
		fetchAll: function () {
			return $http.get('/api/products')
			.then(products => products.data);
		},

		fetchById: function (id) {
			return $http.get('/api/products/' + id)
			.then((product) => {
				console.log("FACTORY", product.data.categories);
				return product.data;
			});
		},

		editById: function (id, data) {
			return $http.put('/api/products/' + id, data)
			.then(product => product.data);
		},

		addProduct: function (data) {
			return $http.post('/api/products', data)
			.then(product => product.data);
		},

		delete: function (id) {
			return $http.delete('/api/products/' + id);
		},

		fetchRecs: function (id) {
			return $http.get('/api/recommendations/similar/' + id)
			.then(res => res.data);
		},

		fetchTopProducts: function() {
			return $http.get('/api/recommendations/top')
				.then(res => res.data);
		}

	};
});