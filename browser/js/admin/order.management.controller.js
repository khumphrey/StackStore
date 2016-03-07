app.controller('OrderManagementCtrl', function($scope, orders, OrderFactory) {
    $scope.orders = orders;
    $scope.availableFilters = OrderFactory.getAvailableFilters();
    $scope.currentFilter = OrderFactory.getCurrentFilter();

    $scope.ordersFilter = function(order) {
        return OrderFactory.ordersFilter(order);
    };

    $scope.setCurrentFilter = function (filter) {
    	OrderFactory.setCurrentFilter(filter);
    };

    $scope.openOrderDetail = function(order) {
        OrderFactory.openOrderDetail(order);
    };

});
