app.config(function ($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/admin/admin-panel.html',
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('admin.orderManagement', {
        url: '/admin/order-management',
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
        url: '/admin/user-management',
        templateUrl: 'js/admin/user-management.html',
        controller: 'UserManagementCtrl',
        resolve: {
        	users: function(UserFactory) {
        		return UserFactory.fetchAll();
        	}
        }
    });
});