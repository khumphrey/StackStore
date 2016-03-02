app.controller('ProductsController', function ($scope, products) {
	$scope.products = products;
	$scope.categories = [];
	$scope.priceSearch = 900;
	$scope.quantitySearch = 1;
	// product.categories =
// [{"_id":"56d6211a41380ba6524bf3e7","name":"pirate ship","__v":0}],
	products.forEach(function(elem){
		elem.categories.forEach(function(categoryObj){
			if ($scope.categories.indexOf(categoryObj.name)===-1)$scope.categories.push(categoryObj.name);
		});
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
});