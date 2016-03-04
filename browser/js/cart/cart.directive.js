// 'use strict';

// app.directive('cartItem', function (CartFactory) {
// 	return {
// 		restrict: "E",
// 		scope:{
// 			item: "=",
// 			cart: "="
// 		},
// 		templateUrl: '/js/cart/cartItem.html',
// 		link: function (scope) {
// 			scope.update = function () {
// 				CartFactory.updateItem(scope.item.product._id, scope.newQuantity)
// 				.then(function () {
// 					scope.item.quantity = scope.newQuantity;
// 					scope.newQuantity = "";
// 				})
// 			}
// 			scope.remove = function () {
// 				CartFactory.removeItem(scope.item.product._id)
// 				.then(function () {
// 					var index = scope.cart.indexOf(scope.item);
// 					if (index === -1) return;
// 					return scope.cart.splice(index, 1);
// 				})
// 			}
// 		}
// 	}
// })