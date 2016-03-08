app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function($scope, topProducts) {
        	$scope.topProducts = topProducts;
        },
        resolve: {
        	topProducts: function(ProductsFactory) {
        		return ProductsFactory.fetchTopProducts();
        	}
        }
    });
});