app.controller('CheckoutCtrl', function($scope, OrderFactory, AuthService, cart) {
	$scope.newOrder = {
		purchasedItems: cart,
		shippingAddress:"test",
		shippingEmail: "test2",
		totalPrice: 40
	};

	// add error handling
	AuthService.getLoggedInUser()
			.then(function(user) {
				if (user) $scope.newOrder.user = user; // if user is not logged in there will be no user on the order
			}),

	$scope.checkout = function() {
		// here we will post to 
		// api/orders 
		// with the cart and the shipping mail and shipping address
		console.log('creating order ', $scope.newOrder)
		OrderFactory.createOrder($scope.newOrder)
			.then(function(createdOrder) {
				console.log('new order created: ', createdOrder);
			})
			.then(null, function(err) {
				console.log('error: ', err);
			});
	}
})