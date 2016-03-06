app.controller('UserOrderCtrl', function ($scope, OrderFactory, userOrders) {

    $scope.orders = userOrders;
    $scope.success = false;
    $scope.failure = false;

    $scope.availableFilters = ['Show All', 'Created', 'Processing', 'Completed', 'Cancelled'];
    $scope.currentFilter = $scope.availableFilters[0];

    $scope.areThereUserOrders = function () {
        return $scope.orders.length > 0;
    };

    $scope.ordersFilter = function(order) {
        if ($scope.currentFilter === "Show All") return true;
        else return order.orderStatus === $scope.currentFilter;
    };

    $scope.setCurrentFilter = function (filter) {
        $scope.currentFilter = filter;
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