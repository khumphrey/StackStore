app.config(function ($stateProvider) {

    $stateProvider.state('user', {
        url: '/user',
        templateUrl: 'js/user/user.html',
        controller: 'UserCtrl',
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        },
        //instead of this resolve, we should utilize get logged in user; use Session factory
        //need all reviews for this user
        resolve: {
            loggedInUser: function (AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    });

});