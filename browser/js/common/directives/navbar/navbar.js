app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $uibModal, $state) {

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

            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'About', state: 'about' },
                { label: 'Documentation', state: 'docs' },
                { label: 'Catalogue', state: 'products' },
                { label: 'Cart', state: 'cart' },
                { label: 'Checkout', state: 'checkout'}
                { label: 'Account', state: 'user.account', auth: true }
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