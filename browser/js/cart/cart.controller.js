'use strict';

app.controller('CartController', function ($scope, cart, CartFactory) {
	$scope.cart = cart;

	$scope.update = function (item) {
		CartFactory.updateItem(item.product._id, item.newQuantity)
		.then(function () {
			item.quantity = item.newQuantity;
			item.newQuantity = "";
		})
	}
	$scope.remove = function (item, index) {
		CartFactory.removeItem(item.product._id)
		.then(function () {
			return $scope.cart.splice(index, 1);
		})
	}
})