var ToDo = angular.module("ToDo", []);

function TodoCtrl($scope, $http){
    $http.get("/items").success(function(data){
        $scope.todos = data;
    }).error(addAlert);

    $scope.alerts = [];

    var addAlert = function(data){
        $scope.alerts.push({class: error, text: data.reason});
    }

    $scope.dismissAlert = function(alert){
        $scope.alerts = _.without($scope.alerts, alert);
    }

    $scope.addNew = function(name){
        $http.post('/items', {text: name, done: false}).success(function(data){
            $scope.todos.push(data);
            $scope.newTodoName = "";
        }).error(addAlert);
    }

    $scope.numberOfTodos = function(){
        return $scope.todos.length;
    }

    $scope.removeItem = function(item){
        $http.delete('/items/' + item.id).success(function(data){
            $scope.todos = _.without($scope.todos, item);
        }).error(addAlert);
    }

    $scope.updateDone = function(item){
        $http.put('/items/' + item.id, {done: item.done});
    }
}
