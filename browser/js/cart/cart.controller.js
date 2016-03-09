'use strict';

app.controller('CartController', function ($scope, cart, CartFactory, $uibModal) {
	$scope.cart = cart;

	$scope.cacheVal = function (item) {
		$scope.cache = item.quantity;
	}

	$scope.revert = function (item) {
		if(!item.quantity) {
			item.quantity = $scope.cache;
			$scope.update(item);
		}
	}

	function checkout(){
		var bool = false;
		$scope.cart.forEach(function (item) {
			if(item.quantity > item.product.quantity){
				bool = true;
			}
		})
		return bool;
	}

	$scope.checkout = checkout();

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

	$scope.update = function (item, index) {
		item.quantity = parseInt(item.quantity);
		if(item.quantity === 0) {
			$scope.change(item, 0, index);
		}
		if(!isNaN(item.quantity)) {
			CartFactory.updateItem(item.product._id, item.quantity)
			.then(function () {
				$scope.total = total();
				$scope.checkout = checkout();
			})
			.then(null, function (err) {
				$scope.error = err.message || "Error updating";
			})
		}
	};

	$scope.remove = function (item, index) {
		CartFactory.removeItem(item.product._id)
		.then(function () {
			$scope.cart.splice(index, 1);
			$scope.total = total();
		})
		.then(null, function (err) {
			$scope.error = err.message || "Error removing";
		})
	};

	$scope.change = function (item, num, index) {
		if(item.quantity + num <= 0) {
			var modal = $uibModal.open({
				animation: true,
				templateUrl: 'js/cart/confirmRemove.html',
				controller: 'cartModalCtrl',
				size: 'md'
			})
			modal.result.then(function(confirmed) {
				if(confirmed) {
					$scope.remove(item, index);
				} 
				else {
					if(item.quantity === 1) return;
					else {
						$scope.update(item);
						return;
					}
				}
			})
		}
		else {
			item.quantity += num;
			$scope.update(item);
		}
	}

	$scope.blurOnEnter = function( $event ) {	
		if($event.keyCode === 13) $event.target.blur();
		return;
	}


});




