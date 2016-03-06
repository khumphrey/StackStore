app.controller('UserCtrl', function ($scope, loggedInUser, UserFactory) {

    $scope.user = loggedInUser;
    $scope.success = false;
    $scope.failure = false;

    $scope.clearAlertMessages = function () {
        $scope.success = false;
        $scope.failure = false;
    };

    $scope.updateAccountInfo = function (userInfo) {
        $scope.success = false;
        $scope.failure = false;
        UserFactory.updateUser(userInfo)
            .then(function () {
                $scope.user.password = "";
                $scope.success = true;
            })
            .then(null, function () {
                $scope.failure = true;
            });
    };

});

