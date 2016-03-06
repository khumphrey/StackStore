app.controller('UserCtrl', function ($scope, $state, loggedInUser, userReviews, UserFactory, ReviewFactory, OrderFactory, userOrders) {
    $scope.user = loggedInUser;
    $scope.reviews = userReviews;
    $scope.orders = userOrders;
    $scope.success = false;
    $scope.failure = false;
    $scope.editing = false;

    //display --- 
        //all orders of user, 
        //all reviews by user, 
        //basic user info (have an editable button and all the user to edit)

    $scope.clearAlertMessages = function () {
        $scope.success = false;
        $scope.failure = false;
    };

    $scope.updateAccountInfo = function (userInfo) {
        $scope.success = false;
        $scope.failure = false;
        UserFactory.updateUser(userInfo)
            .then(function (updatedUser) {
                $scope.user.password = "";
                $scope.success = true;
            })
            .then(null, function (err) {
                $scope.failure = err;
            });
    };

    $scope.areThereUserReviews = function () {
        return $scope.reviews.length > 0;
    };

    $scope.editReview = function (review) {
        $scope.clearAlertMessages();
        $scope.editing = true;
        $scope.review = review;
    };

    $scope.isReviewEditable = function () {
        return $scope.editing;
    };

    $scope.updateReview = function (reviewInfo) {
        $scope.clearAlertMessages();
        ReviewFactory.updateReview(reviewInfo)
            .then(function (updatedReview) {
                $scope.success = true;
                $scope.editing = false;
            })
            .then(null, function (err) {
                $scope.failure = err;
            });
    }; 

    $scope.allReviews = function () {
        $scope.clearAlertMessages();
        $scope.editing = false;
    };

    $scope.areThereUserOrders = function () {
        console.log($scope.orders);
        return $scope.orders.length > 0;
    };

});