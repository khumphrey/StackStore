app.controller('UserManagementCtrl', function($scope, AuthService, UserFactory, users) {

	$scope.users = users;
	AuthService.getLoggedInUser()
		.then(function(currentUser) {
			$scope.currentUser = currentUser;
		});
	
	$scope.promoteUserToAdmin = function(user) {
		UserFactory.promoteToAdmin(user)
			.then(function(updatedUser) {
				// console.log("Updated user: ", user);
			})
			.then(null, function(err) {
				console.log(err);
			});
	};
		
	$scope.demoteAdminToUser = function(user) {
		UserFactory.demoteToUser(user)
			.then(function(updatedUser) {
				console.log("Updated user: ", user);
			})
			.then(null, function(err) {
				console.log(err);
			});
	};
	$scope.resetPassword = function(user) {
		UserFactory.resetPassword(user)
			.then(function(updatedUser) {
				// console.log("Reset password for user " + updatedUser.username);
			})
			.then(null, function(err) {
				console.log(err);
			});
	};
	$scope.deleteUser = function(user) {
		UserFactory.deleteOne(user)
			.then(function() {
				$scope.users.splice($scope.users.indexOf(user), 1);
			})
			.then(null, function(err) {
				console.log(err);
			});	
	};
});