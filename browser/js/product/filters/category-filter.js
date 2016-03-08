app.filter('filterCategories', function() {
    return function(products, categories) {
        return products.filter(function(product) {
// categories = ['motor boat', 'cruise ship', 'pirate ship']
        	return categories.some(function(elem){
// product.categories =
// [{"_id":"56d6211a41380ba6524bf3e7","name":"pirate ship","__v":0}],
				for (var i = 0; i < product.categories.length; i++) {
					if(product.categories[i].name === elem || !product.categories[i].name) return true;
				}

				return false;
        		// return elem === product.categories[0].name;
        	});
        });
    };
});

app.filter('filterPropertyByRange', function(){
    return function(products, prop, minRange, maxRange){
        products = products.filter(function(product){
            return product[prop] >= minRange && product[prop] <= maxRange;
        });
        return products;
    };
});