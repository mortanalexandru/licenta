System.register(['./appConfig', './commons/externalServices'], function (_export) {
    'use strict';

    var app, state, _services;

    function Component() {
        var description = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        return function decorator(target) {
            if (!description.selector) {
                throw new Error('@Component() must contains selector property! ');
            }

            var componentName = description.selector;

            var options = Object.assign({ controller: target, bindings: { standalone: "<" } }, description);

            if (description.template) {
                options.template = function ($element) {
                    $element.addClass(componentName);
                    return description.template;
                };
                options.template.$inject = ['$element'];
            }

            app.component(componentName, options);
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

    function Service(options) {
        return function decorator(target) {
            options = options ? options : {};
            if (!options.serviceName) {
                throw new Error('@Service() must contains serviceName property!');
            }
            app.service(options.serviceName, target);

            app.run(['$injector', function ($injector) {
                _services[options.serviceName] = $injector.get(options.serviceName);
            }]);

            target.instance = function () {
                return _services[options.serviceName];
            };
        };
    }

    //secure decorator, extend secure constructor (check more redirects)

    return {
        setters: [function (_appConfig) {
            app = _appConfig['default'];
        }, function (_commonsExternalServices) {
            state = _commonsExternalServices.state;
        }],
        execute: function () {
            _services = {};

            _export('Component', Component);

            _export('Inject', Inject);

            _export('Service', Service);
        }
    };
});
//# sourceMappingURL=sourcemaps/ngDecorators.js.map
