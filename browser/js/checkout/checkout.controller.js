app.controller('CheckoutCtrl', function($scope, $uibModal, $state, OrderFactory, AuthService, cart) {
    $scope.newOrder = {
        purchasedItems: cart
    };

    // add error handling
    AuthService.getLoggedInUser()
        .then(function(user) {
            if (user) {
            	$scope.newOrder.user = user; // if user is not logged in there will be no user on the order
            	$scope.newOrder.shippingEmail = user.email;
            }
        });

    $scope.checkout = function() {
        console.log('creating order ', $scope.newOrder)
        OrderFactory.createOrder($scope.newOrder)
            .then(function(createdOrder) {
                // show confirmation modal
                var confirmationModal = $uibModal.open({
                    templateUrl: '/js/checkout/confirmation.html',
                    controller: function($scope, $uibModalInstance, $state) {
                        $scope.ok = function() {
                            $uibModalInstance.close();
                        }
                    }
                });
                $state.go('products');
            })
            .then(null, function(err) {
                console.log('error: ', err);
            });
    }
})
