System.register(['/commons/authService', '/commons/socketService', '/commons/externalServices', '/commons/componentConstants'], function (_export) {
    'use strict';

    var authService, socketService, state, LOGIN_STATE, SecuredComponent;
    return {
        setters: [function (_commonsAuthService) {
            authService = _commonsAuthService['default'];
        }, function (_commonsSocketService) {
            socketService = _commonsSocketService['default'];
        }, function (_commonsExternalServices) {
            state = _commonsExternalServices.state;
        }, function (_commonsComponentConstants) {
            LOGIN_STATE = _commonsComponentConstants.LOGIN_STATE;
        }],
        execute: function () {
            SecuredComponent = function SecuredComponent() {
                babelHelpers.classCallCheck(this, SecuredComponent);

                if (!authService().isAuthenticated()) {
                    state().go(LOGIN_STATE);
                } else {
                    if (!socketService().isConnected()) {
                        socketService().connect(authService().getUsername()).then(function () {
                            socketService().setConnected(true);
                        });
                    }
                }
            };

            _export('default', SecuredComponent);
        }
    };
});
//# sourceMappingURL=../sourcemaps/commons/securedComponent.js.map
