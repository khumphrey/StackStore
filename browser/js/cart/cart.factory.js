'use strict';

app.factory('CartFactory', function ($http) {
	return {

		fetchCart: function() {
			return $http.get('/api/cart')
			.then(cart => cart.data);
		},

		addToCart: function(productId, quantity) {
			return $http.post('/api/cart/' + productId, {quantity: quantity})
			.then(cart => cart.data);
		},

		updateItem: function(productId, quantity) {
			return $http.put('/api/cart/' + productId, {quantity: quantity})
			.then(cart => cart.data);
		},

		removeItem: function(productId) {
			return $http.delete('/api/cart/' + productId);
		}
	}
}) 