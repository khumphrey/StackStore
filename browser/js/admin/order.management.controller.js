app.controller('OrderManagementCtrl', function($scope, $uibModal, orders) {
    $scope.orders = orders;
    $scope.availableFilters = ['Show All', 'Created', 'Processing', 'Completed', 'Cancelled'];
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
            animation: $scope.animationsEnabled,
            templateUrl: '/js/admin/order-detail.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                order: function() {
                    return order;
                }
            }
        });
    }

});
