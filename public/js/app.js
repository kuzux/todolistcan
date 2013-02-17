var app = angular.module("ToDo", ['ngResource']);

app.factory("Item", function($resource){
    return $resource("/items/:id", {id:'@id'});
});

function TodoCtrl($scope, Item){

    var addAlert = function(klass){
        return function(data){
            if(_.isArray(data.reason)){
                data.reason.forEach(function(err){
                    $scope.alerts.push({class: klass, text: err});
                });
            } else{
                $scope.alerts.push({class: klass, text: data.reason});
            }
        }
    }

    $scope.alerts = [];

    $scope.todos = Item.query(function(){}, addAlert("error"));

    $scope.searchItems = function(item){
        if(!$scope.searchQuery) return true;
        if($scope.searchQuery.findNew && item.done) return false;
        return item.text.match($scope.searchQuery.text);
    }

    $scope.dismissAlert = function(alert){
        $scope.alerts = _.without($scope.alerts, alert);
    }

    $scope.addNew = function(name){
        if(name=="" || name==undefined) return;
        var item = new Item({text: name, done: false});
        item.$save(function(){
            $scope.todos.push(item);
            $scope.newTodoName = "";
        }, addAlert("error"));
    }

    $scope.numberOfTodos = function(){
        return $scope.todos.length;
    }

    $scope.removeItem = function(item){
        item.$delete(function(){
            $scope.todos = _.without($scope.todos, item);
        }, addAlert("error"));
    }

    $scope.updateDone = function(item){
        item.$save(function(){}, addAlert("error"));
    }
}
