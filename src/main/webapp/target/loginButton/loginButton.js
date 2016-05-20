System.register(['../ngDecorators', './loginButton.html!text', '../commons/authService', '../commons/externalServices', './loginButton.css!'], function (_export) {
    'use strict';

    var Component, Inject, template, authService, state, location, LoginButton;
    return {
        setters: [function (_ngDecorators) {
            Component = _ngDecorators.Component;
            Inject = _ngDecorators.Inject;
        }, function (_loginButtonHtmlText) {
            template = _loginButtonHtmlText['default'];
        }, function (_commonsAuthService) {
            authService = _commonsAuthService['default'];
        }, function (_commonsExternalServices) {
            state = _commonsExternalServices.state;
            location = _commonsExternalServices.location;
        }, function (_loginButtonCss) {}],
        execute: function () {
            LoginButton = (function () {
                function LoginButton($scope, $stateParams) {
                    babelHelpers.classCallCheck(this, _LoginButton);

                    this.scope = $scope;
                    this.stateParams = $stateParams;
                    this.scope.state = state();
                    this.scope.username = authService().getUsername();
                    this.scope.authenticated = this.scope.username != undefined;
                }

                babelHelpers.createClass(LoginButton, [{
                    key: 'logout',
                    value: function logout() {
                        authService().logout();
                        var redirectState = 'search';
                        this.scope.authenticated = false;
                        state().reload();
                    }
                }]);
                var _LoginButton = LoginButton;
                LoginButton = Inject('$scope', '$stateParams')(LoginButton) || LoginButton;
                LoginButton = Component({
                    selector: 'loginbutton',
                    template: template })(LoginButton) || LoginButton;
                return LoginButton;
            })();

            _export('default', LoginButton);
        }
    };
});
//# sourceMappingURL=../sourcemaps/loginButton/loginButton.js.map
