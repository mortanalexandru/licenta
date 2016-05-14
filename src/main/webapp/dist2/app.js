System.register(['angular', './appConfig', 'uiComponents', 'babel-polyfill'], function (_export) {
    'use strict';

    var angular, app;
    return {
        setters: [function (_angular) {
            angular = _angular['default'];
        }, function (_appConfig) {
            app = _appConfig['default'];
        }, function (_uiComponents) {}, function (_babelPolyfill) {}],
        execute: function () {

            angular.element(document).ready(function () {
                angular.bootstrap(document.body, [app.name], {
                    strictDi: true
                });
            });
        }
    };
});
//# sourceMappingURL=../sourcemaps/app/app.js.map
