app.controller('UserCtrl', function ($scope, loggedInUser, UserFactory) {

    $scope.user = loggedInUser;
    $scope.success = false;
    $scope.failure = false;
    $scope.failMessage = false;

    $scope.clearAlertMessages = function () {
        $scope.success = false;
        $scope.failure = false;
    };

    $scope.updateAccountInfo = function (userInfo) {
        $scope.success = false;
        $scope.failure = false;
        UserFactory.updateUser(userInfo)
            .then(function () {
                delete $scope.user.password;
                $scope.success = true;
            })
            .then(null, function (err) {
                //how to gt message to show?? It isn't working
                $scope.failure = true;
                $scope.failMessage = err.data;
            });
    };

});

