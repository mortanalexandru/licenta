System.register(["../ngDecorators", "./externalServices", "./model/user", "./storageService"], function (_export) {
    "use strict";

    var Service, http, q, User, storageService, AuthService;
    return {
        setters: [function (_ngDecorators) {
            Service = _ngDecorators.Service;
        }, function (_externalServices) {
            http = _externalServices.http;
            q = _externalServices.q;
        }, function (_modelUser) {
            User = _modelUser["default"];
        }, function (_storageService) {
            storageService = _storageService["default"];
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
                        return q()((function (resolve, fail) {
                            var headers = { authorization: "Basic " + btoa(username + ":" + password) };

                            http().get('/user', { headers: headers }).success((function (data) {
                                this.authenticated = true;
                                this.currentUser.setCredentials(username, password);
                                storageService().save("username", username);
                                resolve();
                            }).bind(this)).error(function () {
                                fail();
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
                }, {
                    key: "logout",
                    value: function logout() {
                        this.authenticated = false;
                        this.currentUser = new User();
                        storageService().remove("username");
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
//# sourceMappingURL=../sourcemaps/commons/authService.js.map
