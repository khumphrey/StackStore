app.controller('ProductsController', function ($scope, products) {
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
	// product.categories =
// [{"_id":"56d6211a41380ba6524bf3e7","name":"pirate ship","__v":0}],
	products.forEach(function(elem){
		elem.categories.forEach(function(categoryObj){
			if ($scope.categories.indexOf(categoryObj.name)===-1)$scope.categories.push(categoryObj.name);
		});
		if(elem.price>$scope.price.max) $scope.price.max = elem.price;
		if(elem.quantity>$scope.quantity.max) $scope.quantity.max= elem.quantity;
	});
	
	$scope.categoryModel = {};

	$scope.categories.forEach(function(elem){
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
});

app.controller('ProductController', function ($scope, product) {
	$scope.product = product;
	$scope.quantity = 1;

	$scope.addToCart = function(item){
		console.log("item", item);
		// add it to cart
		// CartFactory.addItem(item);
	};

	// $scope.totalItems = 10;
});