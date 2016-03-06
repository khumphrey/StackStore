app.controller('ProductController', function ($scope, $state, product, ReviewFactory, Session, ProductsFactory, $location, $anchorScroll, AuthService) {
	$scope.product = product;
	$scope.item = {quantity:1};
		$scope.isAdmin = function() {
		return AuthService.isAdmin();
	};
	// this should equal if the user is actuall an admin

	$scope.addToCart = function (){
		if ($scope.item.quantity<1) $scope.item.quantity=1;
		$scope.item.product = $scope.product._id;

		// $scope.item = {quantity: 1, product: "56d6211a41380ba6524bf3e9"}

		// CartFactory.addToCart($scope.item.product, $scope.item.quantity);
	};

	$scope.removeProduct = function () {
		ProductsFactory.delete($scope.product._id)
		.then(function(){
			$state.go('products');
		});
	};

	$scope.areThereProductReviews = function () {
		return $scope.product.reviews.length>0;
	};

	$scope.isQuantitySelected = function (){
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

    		$location.hash('bottomReview');
    		$anchorScroll();

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