app.factory('UserFactory', function($http) {

	var fetchAll = function() {
		return $http.get('/api/users')
			.then(res => res.data);
	};
	var fetchOne = function(userId) {
		return $http.get('/api/users/' + userId)
			.then(res => res.data);
	};

	var updateUser = function (user) {
		return $http.put('/api/users/' + user._id, user)
			.then(res => res.data);
	};

	var deleteOne = function(user) {
		return $http.delete('/api/users/' + user._id)
			.then(res => res.data);
	};

	var promoteToAdmin = function(user) {
		user.admin = true;
		return $http.put('/api/users/' + user._id, user)
			.then(res => res.data);
	};

	var demoteToUser = function(user) {
		user.admin = false;
		return $http.put('/api/users/' + user._id, user)
			.then(res => res.data);
	};

	var resetPassword = function(user) {
		user.requiresPasswordReset = true;
		return $http.put('/api/users/' + user._id, user)
			.then(res => res.data);
	};

	return {
		fetchAll: fetchAll,
		fetchOne: fetchOne,
		updateUser: updateUser,
		deleteOne: deleteOne,
		promoteToAdmin: promoteToAdmin,
		demoteToUser: demoteToUser,
		resetPassword: resetPassword
	};
});