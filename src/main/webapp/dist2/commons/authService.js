System.register(["/ngDecorators", "./externalServices", "/commons/model/user", "/commons/storageService"], function (_export) {
    "use strict";

    var Service, http, q, User, storageService, AuthService;
    return {
        setters: [function (_ngDecorators) {
            Service = _ngDecorators.Service;
        }, function (_externalServices) {
            http = _externalServices.http;
            q = _externalServices.q;
        }, function (_commonsModelUser) {
            User = _commonsModelUser["default"];
        }, function (_commonsStorageService) {
            storageService = _commonsStorageService["default"];
        }],
        execute: function () {
            AuthService = (function () {
                function AuthService() {
                    babelHelpers.classCallCheck(this, _AuthService);

                    this.authenticated = false;
                    this.currentUser = new User();
                    this.loginError = false;
                }

                babelHelpers.createClass(AuthService, [{
                    key: "login",
                    value: function login(username, password) {
                        return q()((function (resolve) {
                            var _this = this;

                            http().get('/user', {
                                headers: { authorization: "Basic " + btoa(username + ":" + password) }
                            }).then(function () {
                                _this.loginError = false;
                                _this.authenticated = true;
                                _this.currentUser.setCredentials(username, password);
                                storageService().save("username", username);
                                resolve();
                            }, function () {
                                _this.loginError = true;
                                console.log("fail");
                            });
                        }).bind(this));
                    }
                }, {
                    key: "isAuthenticated",
                    value: function isAuthenticated() {
                        return this.authenticated;
                    }
                }, {
                    key: "getUsername",
                    value: function getUsername() {
                        if (!this.currentUser.username) {
                            this.currentUser.username = storageService().get("username");
                        }
                        return this.currentUser.username;
                    }
                }]);
                var _AuthService = AuthService;
                AuthService = Service({ serviceName: 'authService' })(AuthService) || AuthService;
                return AuthService;
            })();

            _export("default", AuthService.instance);
        }
    };
});
//# sourceMappingURL=../../sourcemaps/app/commons/authService.js.map
