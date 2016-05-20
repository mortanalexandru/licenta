System.register(['angular', 'angular-ui-router'], function (_export) {
    'use strict';

    var angular, app;
    return {
        setters: [function (_angular) {
            angular = _angular['default'];
        }, function (_angularUiRouter) {}],
        execute: function () {
            app = angular.module('web', ['ui.router']);

            app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

                $urlRouterProvider.otherwise('/search');

                $stateProvider.state('login', {
                    url: "/login?redirectState&redirectParams",
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

            _export('default', app);
        }
    };
});
//# sourceMappingURL=sourcemaps/appConfig.js.map
