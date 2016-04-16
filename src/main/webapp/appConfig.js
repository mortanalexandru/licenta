import angular from 'angular';
import "angular-ui-router";


const app = angular.module('web', ['ui.router']);

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('home', {
            url: "/home",
            template: '<home></home>'
        });

    $stateProvider
        .state('login', {
            url: "/login",
            template: '<login></login>'
        });

    $stateProvider
        .state('callPage', {
            url: "/callPage/:destUsername",
            template: '<videochat></videochat><textChat></textChat>'
        });


    $stateProvider
        .state('search', {
            url: "/search",
            template: '<search></search>'
        });

    $stateProvider
        .state('room', {
            url: "/room/:roomName",
            template: '<chatroom></chatroom>'
        });
    //ui router component

}]);


export default app;