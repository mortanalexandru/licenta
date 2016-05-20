System.register(["../ngDecorators", "./externalServices"], function (_export) {
    //import localStorageServiceProvider from "LocalStorageModule"

    "use strict";

    var Service, window, StorageService;
    return {
        setters: [function (_ngDecorators) {
            Service = _ngDecorators.Service;
        }, function (_externalServices) {
            window = _externalServices.window;
        }],
        execute: function () {
            StorageService = (function () {
                function StorageService() {
                    babelHelpers.classCallCheck(this, _StorageService);
                }

                babelHelpers.createClass(StorageService, [{
                    key: "save",
                    value: function save(key, value) {
                        window().sessionStorage[key] = value;
                    }
                }, {
                    key: "get",
                    value: function get(key) {
                        return window().sessionStorage[key];
                    }
                }, {
                    key: "remove",
                    value: function remove(key) {
                        return window().sessionStorage.removeItem(key);
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
//# sourceMappingURL=../sourcemaps/commons/storageService.js.map
