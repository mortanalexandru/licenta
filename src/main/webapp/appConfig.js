import angular from 'angular';
import "angular-ui-router";


const app = angular.module('web', []);

app.config(["$stateProvider", "$urlRouterProvider"],function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: "/home",
                template: '<div class="home"></div>'
            })



});


export default app;