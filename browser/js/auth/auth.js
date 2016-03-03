app.controller('AuthCtrl', function ($scope, AuthService, $state, $uibModalInstance) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendAuth = function (authInfo) {

        $scope.error = null;

        AuthService.login(authInfo)
            .then(null, function () {
                return AuthService.signup(authInfo);
            })
            .then(function () {
                $uibModalInstance.close();
                //check if user.requiresPasswordReset === true
                //go to change password page
                // if (user.requiresPasswordReset) $state.go('user');
                $state.go('products');
            })
            .then(null, function () {
                $scope.error = 'Invalid credentials.';
            });

    };

});