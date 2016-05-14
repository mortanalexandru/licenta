System.register(['/appConfig', 'underscore'], function (_export) {
    'use strict';

    var app, _, ANGULAR_SERVICES, _extServices, http, rootScope, state, window, sce, q;

    return {
        setters: [function (_appConfig) {
            app = _appConfig['default'];
        }, function (_underscore) {
            _ = _underscore['default'];
        }],
        execute: function () {
            ANGULAR_SERVICES = ['$http', '$rootScope', '$state', '$window', '$sce', '$q'];
            _extServices = {};

            app.run(['$injector', function ($injector) {
                ANGULAR_SERVICES.forEach(function (svcName) {
                    return _extServices[svcName] = $injector.get(svcName);
                });
            }]);

            http = function http() {
                return _extServices['$http'];
            };

            rootScope = function rootScope() {
                return _extServices['$rootScope'];
            };

            state = function state() {
                return _extServices['$state'];
            };

            window = function window() {
                return _extServices['$window'];
            };

            sce = function sce() {
                return _extServices['$sce'];
            };

            q = function q() {
                return _extServices['$q'];
            };

            _export('_', _);

            _export('http', http);

            _export('rootScope', rootScope);

            _export('state', state);

            _export('window', window);

            _export('sce', sce);

            _export('q', q);
        }
    };
});
//# sourceMappingURL=../../sourcemaps/app/commons/externalServices.js.map
