app.config(function ($stateProvider) {

    // Register our *products* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'ProductsController',
        templateUrl: 'js/product/products.html',
        resolve: {
        	products: function (ProductsFactory){
        		return ProductsFactory.fetchAll();
        	}
        }
    });

    $stateProvider.state('product', {
        url: '/products/:productId',
        controller: 'ProductController',
        templateUrl: 'js/product/product.html',
        resolve: {
            product: function (ProductsFactory, ReviewFactory, $stateParams){
                return ProductsFactory.fetchById($stateParams.productId)
                    .then(function (product){
                        return ReviewFactory.fetchProdReviews($stateParams.productId)
                        .then(function (reviews){
                            product.reviews = reviews;
                            console.log("STATE", product.categories);
                            return product;
                        });
                    });
            // we can save some latency by having the return from the backend for fetchById include the reviews already
            },
            recs: function (ProductsFactory, $stateParams) {
                return ProductsFactory.fetchRecs($stateParams.productId);
            }
        }
    });

});
