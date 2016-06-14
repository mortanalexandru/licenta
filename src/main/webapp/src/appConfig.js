import angular from 'angular';
import "angular-ui-router";


const app = angular.module('web', ['ui.router']);

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/search');


    $stateProvider
        .state('login', {
            url: "/login?redirectState&redirectParams",
            template: '<login></login>'
        });


    $stateProvider
        .state('search', {
            url: "/search",
            template: '<search></search>'
        });

    $stateProvider
        .state('room', {
            url: "/room/:roomName",
            template: '<chatroom video="true" audio="false" text="true"></chatroom>'
        });

    //ui router component

}]);


export default app;