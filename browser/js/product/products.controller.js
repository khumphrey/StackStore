app.controller('ProductsController', function ($scope, products, ProductsFactory, CategoryFactory, AuthService, CartFactory) {
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
		updateFilters (elem);
	});

	function updateFilters (elem) {
		elem.categories.forEach(function (categoryObj){
			if ($scope.categories.indexOf(categoryObj.name)===-1)$scope.categories.push(categoryObj.name);
		});
		if (elem.price>$scope.price.max) $scope.price.max = elem.price; 
		else if (elem.price<$scope.price.min) $scope.price.min = elem.price; 
		if (elem.quantity>$scope.quantity.max) $scope.quantity.max = elem.quantity;
	}

	
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
	$scope.isAdmin = function() {
		return AuthService.isAdmin();
	};
	// These are to make the category select checkbox/buttons

	$scope.categoryBools = {};
	$scope.categoriesToIDs = {};
	CategoryFactory.fetchAll()
	.then(categories => 
		{
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
			}
		});
	});

	$scope.newProduct = {
			categories: [],
			photoUrl: '/imgBoat/boatImg5.jpg'
			// Still working on uploading images
	};

	// I would make this panel a seperate directive if I could have it update the products in this view and while adding. How is that usually done? event emitter? or storing the products on a the factory and then syncing with that?
	$scope.submitProductForm = function () {
		return ProductsFactory.addProduct($scope.newProduct)
		.then(function(newProduct){
			console.log("Boat has been created in db", newProduct);
			updateFilters (newProduct);

			$scope.products.push(newProduct);

			// for some reason this wont update the view...
		});
		
	};

    $scope.openPanel = {
		isOpen: false,
    	templateUrl: '/js/product/product-form.html',
    	title: 'Add A New Boat',
    	open: function open() {
          $scope.openPanel.isOpen = true;
        },

        close: function close() {
          $scope.openPanel.isOpen = false;
        }
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
		CartFactory.addToCart(productId, 1);	
	};

	$scope.showCaption = function (e) {
		console.log("hovering");
		console.log(e);
		$(e.target).find('.caption').slideDown(250); //.fadeIn(250)
	};

	$scope.hideCaption = function (e) {
		console.log("hovering");
		console.log(e);
		$(e.target).find('.caption').slideUp(250); //.fadeIn(250)
	};
});