app.controller('AuthCtrl', function ($scope, AuthService, $state, $uibModalInstance) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendAuth = function (authInfo) {

        $scope.error = null;
        AuthService.login(authInfo)
            .then(null, function () {
                return AuthService.signup(authInfo);
            })
            .then(function (user) {
                $uibModalInstance.close();
                AuthService.persistCart()
                    .then(function () {
                        //if password reset is required go to user account page 
                        if (user.requiresPasswordReset) $state.go('user.account');
                        else $state.go('products');  
                    })
                    .then(null, function (err) {
                        $scope.error = err.message || 'Cart persistence error';
                    });
            })
            .then(null, function (err) {
                $scope.error = err.message || 'Invalid credentials.';
            });

    };

});