app.controller('CategoryManagementCtrl', function($scope, CategoryFactory, categories) {
	$scope.categories = categories;

	$scope.deleteCategory = function(category) {
		CategoryFactory.deleteCategory(category)
			.then(function() {
				$scope.categories.splice($scope.categories.indexOf(category), 1);
				// console.log('deleted the category: ', category);
			})
			.then(null, function(err) {
				console.log(err);
			})
	}

	$scope.addNewCategory = function() {
		CategoryFactory.addCategory($scope.newCategory)
			.then(function(createdCategory) {
				// console.log('created new category', createdCategory);
				$scope.categories.push(createdCategory);
				$scope.newCategory.name = "";
			})
			.then(null, function(err) {
				console.log(err);
			})
	}
})