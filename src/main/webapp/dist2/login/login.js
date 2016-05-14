System.register(['../ngDecorators', './login.html!text', '/commons/authService', 'commons/externalServices'], function (_export) {
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
        }],
        execute: function () {
            Login = (function () {

                // $state.go

                function Login($scope) {
                    babelHelpers.classCallCheck(this, _Login);

                    this.scope = $scope;
                    this.message = 'This is my login component';
                }

                babelHelpers.createClass(Login, [{
                    key: 'login',
                    value: function login(user) {
                        console.log(user.username);
                        console.log(user.password);
                        authService().login(user.username, user.password).then(function () {
                            state().go("search");
                        });
                    }
                }]);
                var _Login = Login;
                Login = Inject('$scope')(Login) || Login;
                Login = Component({
                    selector: 'login',
                    template: template })(Login) || Login;
                return Login;
            })();

            _export('default', Login);
        }
    };
});
//# sourceMappingURL=../../sourcemaps/app/login/login.js.map
