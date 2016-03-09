app.directive('product', function(CartFactory, AuthService, $state, ProductsFactory) {

    return {
        restrict: 'E',
        templateUrl: 'js/home/product.template.html',
        scope: {
            product: "="
        },
        link: function(scope) {
            scope.addToCart = function (e, productId){
                // console.log(e.currentTarget.parentNode.parentNode)
                CartFactory.addToCart(productId, 1); 
                // send image to cart
                var cart = $('.cart-nav');
                var imgtodrag = $('#' + productId)
                if (imgtodrag) {
                    var imgclone = imgtodrag.clone()
                        .offset({
                        top: imgtodrag.offset().top,
                        left: imgtodrag.offset().left
                    })
                        .css({
                        'opacity': '0.5',
                            'position': 'absolute',
                            'height': '150px',
                            'width': '150px',
                            'z-index': '100'
                    })
                        .appendTo($('body'))
                        .animate({
                        'top': cart.offset().top + 10,
                            'left': cart.offset().left + 10,
                            'width': 75,
                            'height': 75
                    }, 1000);

                    imgclone.animate({
                        'width': 0,
                        'height': 0
                    }, function () {
                        $(this).detach()
                    });
                }

            };
            scope.isAdmin = function() {
                return AuthService.isAdmin();
            };
            scope.removeProduct = function (e, id) {
                ProductsFactory.delete(id)
                .then(function(){
                    e.currentTarget.parentNode.remove()
                });
            };
        }

    };

});