System.register(["/ngDecorators", "/commons/externalServices"], function (_export) {
    //import localStorageServiceProvider from "LocalStorageModule"

    "use strict";

    var Service, window, StorageService;
    return {
        setters: [function (_ngDecorators) {
            Service = _ngDecorators.Service;
        }, function (_commonsExternalServices) {
            window = _commonsExternalServices.window;
        }],
        execute: function () {
            StorageService = (function () {
                function StorageService() {
                    babelHelpers.classCallCheck(this, _StorageService);
                }

                babelHelpers.createClass(StorageService, [{
                    key: "save",

                    //constructor() {
                    //    debugger;
                    //
                    //}

                    value: function save(key, value) {
                        window().sessionStorage[key] = value;
                    }
                }, {
                    key: "get",
                    value: function get(key) {
                        return window().sessionStorage[key];
                    }
                }]);
                var _StorageService = StorageService;
                StorageService = Service({ serviceName: 'storageService' })(StorageService) || StorageService;
                return StorageService;
            })();

            _export("default", StorageService.instance);
        }
    };
});
//# sourceMappingURL=../../sourcemaps/app/commons/storageService.js.map
