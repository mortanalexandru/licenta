'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Service = exports.Inject = exports.Component = undefined;

var _appConfig = require('./appConfig');

var _appConfig2 = _interopRequireDefault(_appConfig);

var _externalServices = require('commons/externalServices');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Component() {
    var description = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return function decorator(target) {
        if (!description.selector) {
            throw new Error('@Component() must contains selector property! ');
        }

        var componentName = description.selector;

        var options = Object.assign({ controller: target }, description);

        if (description.template) {
            options.template = function ($element) {
                // all component top element will have a class with their selector on them - this is to use as css starting point in modular css approach
                $element.addClass(componentName);
                return description.template;
            };
            options.template.$inject = ['$element'];
        }

        _appConfig2.default.component(componentName, options);
    };
}

function Inject() {
    for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
        dependencies[_key] = arguments[_key];
    }

    return function decorator(target, key, descriptor) {
        // if it's true then we inject dependencies into function and not Class constructor
        if (descriptor) {
            var fn = descriptor.value;
            fn.$inject = dependencies;
        } else {
            target.$inject = dependencies;
        }
    };
}

var _services = {};

function Service(options) {
    return function decorator(target) {
        options = options ? options : {};
        if (!options.serviceName) {
            throw new Error('@Service() must contains serviceName property!');
        }
        _appConfig2.default.service(options.serviceName, target);

        _appConfig2.default.run(['$injector', function ($injector) {
            _services[options.serviceName] = $injector.get(options.serviceName);
        }]);

        target.instance = function () {
            return _services[options.serviceName];
        };
    };
}

//secure decorator, extend secure constructor (check more redirects)

exports.Component = Component;
exports.Inject = Inject;
exports.Service = Service;