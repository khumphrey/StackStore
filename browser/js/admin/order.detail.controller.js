app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, order) {

    $scope.order = order;

    $scope.ok = function() {
        $uibModalInstance.close();
    };

});
