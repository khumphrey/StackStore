app.controller('UserCtrl', function ($scope, $state, loggedInUser) {
    $scope.user = loggedInUser;
    $scope.reviews = [];

    //display --- 
        //all orders of user, 
        //all reviews by user, 
        //basic user info (have an editable button and all the user to edit)
    
    //navbar of orders, reviews and user info -- have user info as default?
    //cart should be on the regular navbar??

    //INJECT REVIEW FACTORY
    //use reviews factory to get all reviews for one user
    // var reviewPromise = ReviewFactory.fetchUserReviews($scope.user._id)
    //     .then(function (userReviews) {
    //         angular.copy(userReviews, $scope.reviews);
    //     });
    
    $scope.updateAccountInfo = function (userInfo) {

    };

});