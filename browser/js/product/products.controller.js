app.controller('ProductsController', function ($scope, products) {
	$scope.products = products;
	$scope.categories = ['motor boat', 'cruise ship', 'pirate ship'];
	
	
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