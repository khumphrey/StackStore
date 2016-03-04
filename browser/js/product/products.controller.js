app.controller('ProductsController', function ($scope, products, ProductsFactory) {
	$scope.products = products;
	$scope.categories = [];
	$scope.price = {
		max: 0,
		min: 400,
	};
	$scope.quantity= {
		max: 1,
		min: 1,
	};

	$scope.removeProduct = function (id) {
		ProductsFactory.delete(id)
		.then(function(){
			for (var i = 0; i < $scope.products.length; i++) {
				if ($scope.products[i]._id===id) {
					$scope.products.splice(i,1);
					break;
				}
			}
		});
	};
	
	products.forEach(function (elem){
		elem.categories.forEach(function (categoryObj){
			if ($scope.categories.indexOf(categoryObj.name)===-1)$scope.categories.push(categoryObj.name);
		});
		if (elem.price>$scope.price.max) $scope.price.max = elem.price;
		if (elem.quantity>$scope.quantity.max) $scope.quantity.max= elem.quantity;
	});
	
	$scope.categoryModel = {};

	$scope.categories.forEach(function (elem){
			$scope.categoryModel[elem]=true;
	});
		
	$scope.categoryResults = [];

	$scope.$watchCollection('categoryModel', function () {
		$scope.categoryResults = [];
		angular.forEach($scope.categoryModel, function (value, key) {
			if (value) {
				$scope.categoryResults.push(key);
			}
		});
	});



	$scope.addToCart = function (productId){
		// add 1 of item to cart.
		// CartFactory.addToCart(productId, 1);	
	};
});