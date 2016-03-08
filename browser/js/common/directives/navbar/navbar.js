app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $uibModal, $state, CartFactory) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {

            scope.open = function() {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'js/auth/auth.html',
                    controller: 'AuthCtrl',
                    size: 'md'
                });
            };

            // CartFactory.fetchCart()
            // .then(function(itemList){
            //     scope.total = itemList.length;
            // })

            scope.items = [
                { label: 'HOME', state: 'home' },
                { label: 'CATALOGUE', state: 'products' },
                { label: 'CART', state: 'cart' },
                { label: 'ACCOUNT', state: 'user.account', auth: true }
            ];

            scope.user = null;

            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            var removeUser = function() {
                scope.user = null;
            };

            scope.isAdmin = function() {
                return AuthService.isAdmin();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    removeUser();
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                });
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});