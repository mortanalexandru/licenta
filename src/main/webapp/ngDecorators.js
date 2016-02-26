function Component(description = {}) {
    return function decorator(target) {
        if (!description.selector) {
            throw new Error('@Component() must contains selector property! ');
        }

        const componentName = description.selector;

        const options = Object.assign({ controller: target }, description);

        if (description.template) {
            options.template = function($element) {
                // all component top element will have a class with their selector on them - this is to use as css starting point in modular css approach
                $element.addClass(camelCaseToDashCase(componentName));
                return description.template;
            };
            options.template.$inject = ['$element'];
        }

        app.component(componentName, options);
    };
}