app.controller('ProductController', function ($scope, product, ReviewFactory, Session) {
	$scope.product = product;
	$scope.item = {quantity:1};

	$scope.addToCart = function (){
		if ($scope.item.quantity<1) $scope.item.quantity=1;
		$scope.item.product = $scope.product._id;

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