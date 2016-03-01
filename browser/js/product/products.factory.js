app.factory('ProductsFactory', function ($http) {
	return {

		fetchAll: function() {
			return $http.get('/api/products')
			.then(products => products.data);
		}

	};
});