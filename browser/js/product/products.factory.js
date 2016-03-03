app.factory('ProductsFactory', function ($http) {
	return {
		fetchAll: function() {
			return $http.get('/api/products')
			.then(products => products.data);
		},
		fetchById: function(id) {
			return $http.get('/api/products/' + id)
			.then(product => product.data);
		}
	};
});