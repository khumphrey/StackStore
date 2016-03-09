app.directive('product', function(CartFactory) {

    return {
        restrict: 'E',
        templateUrl: 'js/home/product.template.html',
        scope: {
            product: "="
        },
        link: function(scope) {
            scope.addToCart = function (productId){
                CartFactory.addToCart(productId, 1);    
            };
        }

    };

});