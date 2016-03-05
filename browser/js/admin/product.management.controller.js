app.controller('ProductManagementCtrl', function($scope, products, categories) {
	$scope.products = products;
	$scope.availableFilters = categories.map(function(category) {
		return category.name;
	});
	$scope.availableFilters.unshift('Show All');
	$scope.currentFilter = $scope.availableFilters[0];

	// filter the products who have the current filter category in their category array
	$scope.productsFilter = function(product) {
		if ($scope.currentFilter === 'Show All') return true;
		else return !!product.categories.filter(function(category) {
			return category.name === $scope.currentFilter
		}).length;
	};

	$scope.setCurrentFilter = function(filter) {
		$scope.currentFilter = filter;
	};
})