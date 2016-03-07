app.config(function ($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/admin/admin-panel.html',
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('admin.orderManagement', {
        url: '/order-management',
        templateUrl: 'js/admin/order-management.html',
        controller: 'OrderManagementCtrl',
        resolve: {
            orders: function(OrderFactory) {
                return OrderFactory.fetchAll();
            }
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('admin.userManagement', {
        url: '/user-management',
        templateUrl: 'js/admin/user-management.html',
        controller: 'UserManagementCtrl',
        resolve: {
        	users: function(UserFactory) {
        		return UserFactory.fetchAll();
        	}
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('admin.productManagement', {
        url: '/product-management',
        templateUrl: 'js/admin/product-management.html',
        controller: 'ProductManagementCtrl',
        resolve: {
            products: function(ProductsFactory) {
                return ProductsFactory.fetchAll();
            },
            categories: function(CategoryFactory) {
                return CategoryFactory.fetchAll();
            }
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('admin.categoryManagement', {
        url: '/category-management',
        templateUrl: 'js/admin/category-management.html',
        controller: 'CategoryManagementCtrl',
        resolve: {
            categories: function(CategoryFactory) {
                return CategoryFactory.fetchAll();
            }
        }
    });
});