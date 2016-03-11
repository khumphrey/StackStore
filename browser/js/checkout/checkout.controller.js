app.controller('CheckoutCtrl', function($scope, $uibModal, $state, OrderFactory, AuthService, cart) {
    $scope.newOrder = {
        purchasedItems: cart
    };

    // Total Price should be abstracted away and made available by the CartFactory
    $scope.totalPrice = cart.reduce(function(sum, item) {
        return sum + item.quantity * item.product.price;
    }, 0);

    // add error handling

    /*
        TMK: why not put this in a resolve block?
    */
    AuthService.getLoggedInUser()
        .then(function(user) {
            if (user) {
            	$scope.newOrder.user = user; // if user is not logged in there will be no user on the order
            	$scope.newOrder.shippingEmail = user.email;
                $scope.newOrder.streetAddress = user.streetAddress;
                $scope.newOrder.city = user.city;
                $scope.newOrder.state = user.state;
                $scope.newOrder.zipCode = user.zipCode;
            }
        });

    $scope.checkout = function() {
        console.log('creating order ', $scope.newOrder)
        OrderFactory.createOrder($scope.newOrder)
            .then(function() {
                // show confirmation modal
                $uibModal.open({
                    templateUrl: '/js/checkout/confirmation.html',
                    controller: ['$scope', '$uibModalInstance', '$state' , function($scope, $uibModalInstance, $state) {
                        $scope.ok = function() {
                            $uibModalInstance.close();
                        }
                    }]
                });
                $state.go('products');
            })
            .then(null, function(err) {
                console.log('error: ', err);
            });
    }
})
