app.controller('UserOrderCtrl', function ($scope, OrderFactory, userOrders) {

    $scope.orders = userOrders;
    $scope.success = false;
    $scope.failure = false;

    $scope.availableFilters = OrderFactory.getAvailableFilters();
    $scope.currentFilter = OrderFactory.getCurrentFilter();

    $scope.areThereUserOrders = function () {
        return $scope.orders.length > 0;
    };

    $scope.ordersFilter = function(order) {
        return OrderFactory.ordersFilter(order);
    };

    $scope.setCurrentFilter = function (filter) {
        OrderFactory.setCurrentFilter(filter);
    };

    $scope.openOrderDetail = function(order) {
        OrderFactory.openOrderDetail(order);
    };

    $scope.clearAlertMessages = function () {
        $scope.success = false;
        $scope.failure = false;
    };


    $scope.cancelOrder = function (order) {
        $scope.clearAlertMessages();
        OrderFactory.changeOrderStatus(order, "Cancelled")
            .then(function () {
                $scope.success = true;
            })
            .then(function () {
                $scope.failure = true;
            });
    };

});