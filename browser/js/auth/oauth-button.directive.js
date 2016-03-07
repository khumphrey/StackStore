'use strict';

app.directive('oauthButton', function ($http) {
	return {
		scope: {
			providerName: '@'
		},
		restrict: 'E',
		templateUrl: '/js/auth/oauth-button.html'
	};
});