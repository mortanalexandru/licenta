System.register(['../ngDecorators', './login.html!text', '../commons/authService', '../commons/externalServices', './login.css!'], function (_export) {
    'use strict';

    var Component, Inject, template, authService, state, Login;
    return {
        setters: [function (_ngDecorators) {
            Component = _ngDecorators.Component;
            Inject = _ngDecorators.Inject;
        }, function (_loginHtmlText) {
            template = _loginHtmlText['default'];
        }, function (_commonsAuthService) {
            authService = _commonsAuthService['default'];
        }, function (_commonsExternalServices) {
            state = _commonsExternalServices.state;
        }, function (_loginCss) {}],
        execute: function () {
            Login = (function () {
                function Login($scope, $stateParams) {
                    babelHelpers.classCallCheck(this, _Login);

                    this.scope = $scope;
                    this.stateParams = $stateParams;
                }

                babelHelpers.createClass(Login, [{
                    key: 'login',
                    value: function login(user) {
                        authService().login(user.username, user.password).then((function () {
                            var redirectState = 'search';
                            var params = undefined;
                            if (this.stateParams.redirectState) {
                                redirectState = this.stateParams.redirectState;
                            }
                            if (this.stateParams.redirectParams) {
                                params = JSON.parse(this.stateParams.redirectParams);
                            }
                            state().go(redirectState, params);
                        }).bind(this), (function () {
                            this.scope.error = "Login failed! Please try again!";
                        }).bind(this));
                    }
                }]);
                var _Login = Login;
                Login = Inject('$scope', '$stateParams')(Login) || Login;
                Login = Component({
                    selector: 'login',
                    template: template })(Login) || Login;
                return Login;
            })();

            _export('default', Login);
        }
    };
});
//# sourceMappingURL=../sourcemaps/login/login.js.map
