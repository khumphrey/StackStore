app.factory('ProductsFactory', function ($http) {
	return {
		fetchAll: function () {
			return $http.get('/api/products')
			.then(products => products.data);
		},
		fetchById: function (id) {
			return $http.get('/api/products/' + id)
			.then(product => product.data);
		}
	};
});

app.factory('ReviewFactory', function ($http){
	return {
		addReview: function (data) {
			return $http.post('/api/reviews', data)
			.then(newReview => newReview.data);
		},

		fetchProdReviews: function (productId) {
			return $http.get('/api/reviews?product=' + productId)
			.then(reviews => reviews.data);

		}


	};
});