'use strict';

app.directive('oauthButton', function () {
	return {
		scope: {
			providerName: '@'
		},
		restrict: 'E',
		templateUrl: '/js/auth/oauth-button.html'
	};
});