'use strict';

app.config(function ($stateProvider) {

	//Register our *cart* state.
	$stateProvider.state('cart', {
		url: '/cart',
		controller: 'CartController',
		templateUrl: 'js/cart/cart.html',
		resolve: {
        	cart: function(CartFactory){
        		return CartFactory.fetchCart();
        	}
        }
	});
});