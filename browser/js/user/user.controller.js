app.controller('UserCtrl', function ($scope, $state, loggedInUser, userReviews, UserFactory, ReviewFactory) {
    $scope.user = loggedInUser;
    $scope.reviews = userReviews;
    $scope.success = false;
    $scope.failure;


    //display --- 
        //all orders of user, 
        //all reviews by user, 
        //basic user info (have an editable button and all the user to edit)
    
    //navbar of orders, reviews and user info -- have user info as default?
    //cart should be on the regular navbar??

    //use reviews factory to get all reviews for one user
    
    $scope.updateAccountInfo = function (userInfo) {
        $scope.success = false;
        $scope.failure = false;
        userInfo._id = $scope.user._id;
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

});