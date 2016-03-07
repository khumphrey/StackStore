app.controller('UserReviewCtrl', function ($scope, userReviews, UserFactory, ReviewFactory) {

    $scope.reviews = userReviews;
    $scope.success = false;
    $scope.failure = false;
    $scope.editing = false;

    $scope.clearAlertMessages = function () {
        $scope.success = false;
        $scope.failure = false;
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
            .then(function () {
                $scope.success = true;
                $scope.editing = false;
            })
            .then(null, function () {
                $scope.failure = true;
            });
    }; 

    $scope.toAllReviews = function () {
        $scope.clearAlertMessages();
        $scope.editing = false;
    };

    $scope.areThereUserReviews = function () {
        return $scope.reviews.length > 0;
    };

});