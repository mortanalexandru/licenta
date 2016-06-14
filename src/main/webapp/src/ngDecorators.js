import app from './appConfig';
import {state} from "./commons/externalServices";

function Component(description = {}) {
    return function decorator(target) {
        if (!description.selector) {
            throw new Error('The selector property is missing ');
        }

        const componentName = description.selector;

        const options = Object.assign({ controller: target, bindings: {standalone: "<", video: "<", audio: "<", text: "<"} }, description);

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
            throw new Error('The service name is missing');
        }
        app.service(options.serviceName, target);

        app.run(['$injector', ($injector) => {
            _services[options.serviceName] = $injector.get(options.serviceName);
        }]);

        target.instance = () => _services[options.serviceName];
    };
}



export {Component, Inject, Service};