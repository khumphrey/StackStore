app.controller('ProductsController', function ($scope, products, ProductsFactory) {
	// Code for the filtering of items:
	$scope.products = products;
	$scope.categories = [];
	$scope.price = {
		max: 0,
		min: 400,
	};
	$scope.quantity = {
		max: 1,
		min: 1,
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


	$scope.isAdmin = true;
	$scope.categoriesIds = ["56d6211a41380ba6524bf3e7", "56d6211a41380ba6524bf3e5"];
	// this should be an object that maps names to ids and show the admins the names gotten from the server
	// Code for admin functions:

	$scope.newProduct = {
			title: "",
			description: "",
			price: 1,
			quantity: 1,
			categories: $scope.categoriesIds,
			// photoUrl: url??
			// should we let them upload an image?
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

	$scope.createProduct = function () {
		ProductsFactory.addProduct()
		.then(function(){
			for (var i = 0; i < $scope.products.length; i++) {
				if ($scope.products[i]._id===id) {
					$scope.products.splice(i,1);
					break;
				}
			}
		});
	};


	// Quick add 1 to cart
	$scope.addToCart = function (productId){
		// CartFactory.addToCart(productId, 1);	
	};
});