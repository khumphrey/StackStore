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
