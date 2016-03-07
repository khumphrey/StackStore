app.factory('ReviewFactory', function ($http){
	return {
		addReview: function (data) {
			return $http.post('/api/reviews', data)
			.then(newReview => newReview.data);
		},

		fetchProdReviews: function (productId) {
			return $http.get('/api/reviews?product=' + productId)
			.then(reviews => reviews.data);
		},

		fetchUserReviews: function (userId) {
			return $http.get('/api/reviews?user=' + userId)
			.then(reviews => reviews.data);
		},

		updateReview: function (review) {
			return $http.put('/api/reviews/' + review._id, review)
			.then(updatedReview => updatedReview.data);
		}

	};
});