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

    $stateProvider.state('product', {
        url: '/products/:productId',
        controller: 'ProductController',
        templateUrl: 'js/product/product.html',
        resolve: {
            product: function(ProductsFactory, $stateParams){
                return ProductsFactory.fetchById($stateParams.productId);
            }
        }
    });

});
