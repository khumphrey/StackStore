app.config(function ($stateProvider) {

    // Register our *products* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'ProductsController',
        templateUrl: 'js/products/products.html',
        resolve: {
        	products: function(ProductsFactory){
        		return ProductsFactory.getAll();
        	}
        }
    });

});

app.controller('ProductsController', function ($scope, products) {
	
});

app.factory('ProductsFactory', function ($http) {
	return {

		fetchAll: function() {
			return $http.get('/api/products')
			.then(products => products.data);
		}

	};
});