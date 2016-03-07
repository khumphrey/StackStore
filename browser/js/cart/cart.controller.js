'use strict';

app.controller('CartController', function ($scope, cart, CartFactory) {
	$scope.cart = cart;

	var total = function() {
		$scope.itemstot = 0;
		var tot = 0;
		for(var i=0; i<$scope.cart.length; i++) {
			tot += ($scope.cart[i].product.price * $scope.cart[i].quantity);
			$scope.itemstot += parseInt($scope.cart[i].quantity);
		}
		return tot;
	};

	$scope.total = total();

	$scope.update = function (item) {
		item.quantity = parseInt(item.quantity);
		if(!isNaN(item.quantity)) {
			CartFactory.updateItem(item.product._id, item.quantity)
			.then(function () {
				$scope.total = total();
			});
		}
	};

	$scope.remove = function (item, index) {
		CartFactory.removeItem(item.product._id)
		.then(function () {
			return $scope.cart.splice(index, 1);
		});
	};

	$scope.change = function (item, num, index) {
		if(item.quantity + num <= 0) {
			var yn = confirm("Are you sure you want to remove this item from your cart?");
			if(yn === false){
				return;
			} 
			else {
				$scope.remove(item, index);
				return;			}
		}
		item.quantity += num;
		$scope.update(item);
	}
});