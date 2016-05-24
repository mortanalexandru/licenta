import app from './appConfig';
import {state} from "./commons/externalServices";

function Component(description = {}) {
    return function decorator(target) {
        if (!description.selector) {
            throw new Error('@Component() must contains selector property! ');
        }

        const componentName = description.selector;

        const options = Object.assign({ controller: target, bindings: {standalone: "<"} }, description);

        if (description.template) {
            options.template = function($element) {
                $element.addClass(componentName);
                return description.template;
            };
            options.template.$inject = ['$element'];
        }


        app.component(componentName, options);
    };
}

function Inject(...dependencies) {
    return function decorator(target, key, descriptor) {
        // if it's true then we inject dependencies into function and not Class constructor
        if(descriptor) {
            const fn = descriptor.value;
            fn.$inject = dependencies;
        } else {
            target.$inject = dependencies;
        }
    };
}

const _services = {};

function Service(options) {
    return function decorator(target) {
        options = options ? options : {};
        if (!options.serviceName) {
            throw new Error('@Service() must contains serviceName property!');
        }
        app.service(options.serviceName, target);

        app.run(['$injector', ($injector) => {
            _services[options.serviceName] = $injector.get(options.serviceName);
        }]);

        target.instance = () => _services[options.serviceName];
    };
}

//secure decorator, extend secure constructor (check more redirects)


export {Component, Inject, Service};