app.controller('ProductController', function ($scope, $state, product, ReviewFactory, Session, ProductsFactory, $location, $anchorScroll, AuthService, CategoryFactory, CartFactory, recs) {
	$scope.product = product;
	$scope.recProds = recs;
	// assigning this way does not keep the categories objects?
	$scope.populatingCategories = product.categories;

	$scope.item = {quantity:1};

	$scope.isAdmin = function() {
		return AuthService.isAdmin();
	};
	// this should equal if the user is actuall an admin

	$scope.addToCart = function (){
		var prodId = $scope.product._id
		CartFactory.addToCart(prodId, $scope.item.quantity);
		// send image to cart
		var cart = $('.cart-nav');
        var imgtodrag = $('#' + prodId)
        if (imgtodrag) {
            var imgclone = imgtodrag.clone()
                .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
                .css({
                'opacity': '0.5',
                    'position': 'absolute',
                    'height': '150px',
                    'width': '150px',
                    'z-index': '100'
            })
                .appendTo($('body'))
                .animate({
                'top': cart.offset().top + 10,
                    'left': cart.offset().left + 10,
                    'width': 75,
                    'height': 75
            }, 1000);

            imgclone.animate({
                'width': 0,
                'height': 0
            }, function () {
                $(this).detach()
            });
        }
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


	//Edit product panel
	$scope.categoryBools = {};
	$scope.categoriesToIDs = {};
	CategoryFactory.fetchAll()
	.then(categories => 
		{
			$scope.allCategories = categories;
			categories.forEach(function (dbCat){

				$scope.categoriesToIDs[dbCat.name]=dbCat._id;

				$scope.categoryBools[dbCat.name] = $scope.populatingCategories.some(function(prodCat){
					return prodCat.name===dbCat.name;
				});

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

	$scope.newProduct = $scope.product;
	// should be able to pass this directly to the panel

	$scope.submitProductForm = function () {
		ProductsFactory.editById($scope.product._id, $scope.product)
		.then(function(updatedProduct){
			console.log("Boat has been edited in db", updatedProduct);
			// update the $scope.populatingCategories;
		});
	};

	$scope.openPanel = {
		isOpen: false,
    	templateUrl: '/js/product/product-form.html',
    	title: 'Edit This Boat',
    	open: function open() {
          $scope.openPanel.isOpen = true;
        },

        close: function close() {
          $scope.openPanel.isOpen = false;
        }
    };



	$scope.showCaption = function (e) {
		$(e.target).find('.caption').slideDown(250); //.fadeIn(250)
	};

	$scope.hideCaption = function (e) {
		$(e.target).find('.caption').slideUp(250); //.fadeIn(250)
	};

});