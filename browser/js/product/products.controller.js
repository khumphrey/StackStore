app.controller('ProductsController', function ($scope, products, ProductsFactory, CategoryFactory) {
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


		
	// Code for admin functions:
	$scope.isAdmin = true;
	// These are to make the category select checkbox/buttons

	$scope.categoryBools = {};
	$scope.categoriesToIDs = {};
	CategoryFactory.fetchAll()
	.then(categories => 
		{
			// $scope.newProduct.categories = categories;
			$scope.allCategories = categories;
			categories.forEach(function (elem){
				$scope.categoryBools[elem.name]=true;
				$scope.categoriesToIDs[elem.name]=elem._id;
			});
			
		});

	$scope.$watchCollection('categoryBools', function () {
		$scope.newProduct.categories = [];
		angular.forEach($scope.categoryBools, function (value, key) {
			if (value) {
				$scope.newProduct.categories.push($scope.categoriesToIDs[key]);
				// need these to be the Id's not the names..
			}
		});
	});

	$scope.newProduct = {
			categories: [],
			// photoUrl: url??
			// should we let them upload an image?
	};

	$scope.createProduct = function () {
		ProductsFactory.addProduct($scope.newProduct)
		.then(function(newProduct){
			$scope.products.unshift(newProduct);
		});
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


	// Quick add 1 to cart
	$scope.addToCart = function (productId){
		// CartFactory.addToCart(productId, 1);	
	};
});