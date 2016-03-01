app.config(function ($stateProvider) {

    // Register our *products* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'ProductsController',
        templateUrl: 'js/product/products.html',
        resolve: {
        	products: function(ProductsFactory){
        		return ProductsFactory.fetchAll();
        	}
        }
    });

});

app.controller('ProductsController', function ($scope, products) {
	$scope.products = products;
});

app.factory('ProductsFactory', function ($http) {
	return {

		fetchAll: function() {
			return $http.get('/api/products')
			.then(products => products.data);
		}

	};
});