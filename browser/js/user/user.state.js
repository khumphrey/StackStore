app.config(function($stateProvider) {

    $stateProvider.state('user', {
            url: '/user',
            templateUrl: 'js/user/templates/user.html',
            controller: 'UserCtrl',
            // The following data.authenticate is read by an event listener
            // that controls access to this state. Refer to app.js.
            data: {
                authenticate: true
            },
            //instead of this resolve, we should utilize get logged in user; use Session factory
            //need all reviews for this user
            resolve: {
                loggedInUser: function(AuthService) {
                    return AuthService.getLoggedInUser();
                },
                userReviews: function(ReviewFactory, loggedInUser) {
                    return ReviewFactory.fetchUserReviews(loggedInUser._id);
                },
                userOrders: function (OrderFactory, loggedInUser) {
                    return OrderFactory.fetchAll("?user="+loggedInUser._id);
                }
            }
        })
        .state('user.account', {
            url: '/account',
            templateUrl: 'js/user/templates/user.account.html',
            controller: 'UserCtrl',
            data: {
                authenticate: true
            }
        })
        .state('user.reviews', {
            url: '/reviews',
            templateUrl: 'js/user/templates/user.reviews.html',
            controller: 'UserReviewCtrl',
            data: {
                authenticate: true
            }
        })
        .state('user.orders', {
            url: '/orders',
            templateUrl: 'js/user/templates/user.orders.html',
            controller: 'UserOrderCtrl',
            data: {
                authenticate: true
            }
        });

});