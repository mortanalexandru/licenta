'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-ui-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _angular2.default.module('web', ['ui.router']);

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider.state('login', {
        url: "/login",
        template: '<login></login>'
    });

    $stateProvider.state('search', {
        url: "/search",
        template: '<search></search>'
    });

    $stateProvider.state('room', {
        url: "/room/:roomName",
        template: '<chatroom></chatroom>'
    });
    //ui router component
}]);

exports.default = app;