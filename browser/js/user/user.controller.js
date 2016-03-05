app.controller('UserCtrl', function ($scope, $state, loggedInUser, userReviews, UserFactory, ReviewFactory) {
    $scope.user = loggedInUser;
    $scope.reviews = userReviews;
    $scope.userInfoSuccess = false;
    $scope.userInfoFailure = false;
    $scope.reviewSuccess = false;
    $scope.reviewFailure = false;

    //display --- 
        //all orders of user, 
        //all reviews by user, 
        //basic user info (have an editable button and all the user to edit)
    
    //navbar of orders, reviews and user info -- have user info as default?
    //cart should be on the regular navbar??

    //use reviews factory to get all reviews for one user
    
    $scope.updateAccountInfo = function (userInfo) {
        $scope.userInfoSuccess = false;
        $scope.userInfoFailure = false;
        UserFactory.updateUser(userInfo)
            .then(function (updatedUser) {
                $scope.user.password = "";
                $scope.userInfoSuccess = true;
            })
            .then(null, function (err) {
                $scope.userInfoFailure = err;
            });
    };

    $scope.areThereUserReviews = function () {
        // console.log('reviews', $scope.reviews[0])
        return $scope.reviews.length > 0;
    };

    $scope.updateReview = function (reviewInfo) {
        console.log(reviewInfo)
        $scope.reviewSuccess = false;
        $scope.reviewFailure = false;
        ReviewFactory.updateReview(reviewInfo)
            .then(function (updatedReview) {
                $scope.reviewSuccess = true;
            })
            .then(null, function (err) {
                $scope.reviewFailure = err;
            });
    }; 

});