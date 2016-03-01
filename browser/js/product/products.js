app.config(function ($stateProvider) {

    // Register our *products* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'ProductsController',
        templateUrl: 'js/products/products.html',
        resolve: {
        	products: function(ProductsFactory){

        	}
        }
    });

});

app.controller('ProductsController', function ($scope, products) {
	
});

app.factory('ProductsFactory', function ($http) {
	
});