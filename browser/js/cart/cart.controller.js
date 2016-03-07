'use strict';

app.controller('CartController', function ($scope, cart, CartFactory) {
	$scope.cart = cart;	

	var total = function() {
		var tot = 0;
		for(var i=0; i<$scope.cart.length; i++) {
			tot += ($scope.cart[i].product.price * $scope.cart[i].quantity);
		}
		return tot;
	};

	$scope.total = total();

	$scope.update = function (item) {
		if(typeof item.quantity !== "number" && item.quantity !== "") {
			alert("Please enter a number");
			item.quantity = 1;
			return;
		}
		if(item.quantity !== "") {
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

	$scope.change = function (item, num) {
		if(item.quantity + num <= 0) {
			alert("whoa there sir and/or ma'am");
			return;
		}
		item.quantity += num;
		$scope.update(item);
	}
});