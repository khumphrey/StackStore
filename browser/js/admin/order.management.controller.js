app.controller('OrderManagementCtrl', function($scope, $uibModal, orders, OrderFactory) {
    $scope.orders = orders;
    $scope.availableFilters = OrderFactory.availableFilters;
    $scope.currentFilter = $scope.availableFilters[0];

    $scope.ordersFilter = function(order) {
        if ($scope.currentFilter === "Show All") return true;
        else return order.orderStatus === $scope.currentFilter;
    }

    $scope.setCurrentFilter = function (filter) {
    	$scope.currentFilter = filter;
    }

    $scope.openOrderDetail = function(order) {
        var modalInstance = $uibModal.open({
            templateUrl: '/js/admin/order-detail.html',
            controller: 'OrderDetailCtrl',
            size: 'lg',
            resolve: {
                order: function() {
                    return order;
                }
            }
        });
    }

});
