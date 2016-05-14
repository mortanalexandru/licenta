'use strict';

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _appConfig = require('./appConfig');

var _appConfig2 = _interopRequireDefault(_appConfig);

require('uiComponents');

require('babel-polyfill');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

_angular2.default.element(document).ready(function () {
    _angular2.default.bootstrap(document.body, [_appConfig2.default.name], {
        strictDi: true
    });
});