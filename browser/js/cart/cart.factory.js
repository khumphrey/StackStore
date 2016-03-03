app.factory('CartFactory', function ($http) {
	return {

		fetchCart: function() {
			return $http.get('/api/cart')
			.then()
		},

		updateItem: function(index) {
			return $http.put('/api/cart/')
		}


	}
}) 