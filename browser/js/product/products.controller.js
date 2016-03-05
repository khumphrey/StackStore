app.controller('ProductsController', function ($scope, products, CartFactory) {
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
		CartFactory.addToCart(productId, 1);	
	};
});

app.controller('ProductController', function ($scope, product, ReviewFactory, Session) {
	$scope.product = product;
	$scope.item = {quantity:1};

	$scope.addToCart = function (){
		if ($scope.item.quantity<1) $scope.item.quantity=1;
		$scope.item.product = $scope.product._id;

		console.log("Item", $scope.item);
		// $scope.item = {quantity: 1, product: "56d6211a41380ba6524bf3e9"}

		// CartFactory.addToCart($scope.item.product, $scope.item.quantity);
	};

	$scope.areThereProductReviews = function () {
		return $scope.product.reviews.length>0;
	};

	$scope.quantitySelected = function (){
		return $scope.item.quantity>1;
	};

	$scope.createReview = function (){
		$scope.newReview.product = $scope.product._id;
		ReviewFactory.addReview($scope.newReview)
		.then(function(newReview){
			// add the username from the current session
			newReview.user = {
				username: Session.user.username,
				_id: newReview.user
			};
			$scope.product.reviews.push(newReview);


		// scroll to bottom of page and clear form
			$scope.newReview = {};
			$scope.reviewForm.$setPristine();
		})
		.then(null, function(err){
			$scope.hasSubmitted = false;
      		$scope.serverError = err.message || 'Something went wrong!';
		});

	};
});