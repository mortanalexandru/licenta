System.register(['angular', 'babel-polyfill', './appConfig', './uiComponents'], function (_export) {
    'use strict';

    var angular, app;
    return {
        setters: [function (_angular) {
            angular = _angular['default'];
        }, function (_babelPolyfill) {}, function (_appConfig) {
            app = _appConfig['default'];
        }, function (_uiComponents) {}],
        execute: function () {

            angular.element(document).ready(function () {
                angular.bootstrap(document.body, [app.name], {
                    strictDi: true
                });
            });
        }
    };
});
//# sourceMappingURL=sourcemaps/app.js.map
