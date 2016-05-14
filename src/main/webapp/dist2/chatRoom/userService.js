System.register(["/ngDecorators", "/commons/externalServices"], function (_export) {
    "use strict";

    var Service, http, q, UserService;
    return {
        setters: [function (_ngDecorators) {
            Service = _ngDecorators.Service;
        }, function (_commonsExternalServices) {
            http = _commonsExternalServices.http;
            q = _commonsExternalServices.q;
        }],
        execute: function () {
            UserService = (function () {
                function UserService() {
                    babelHelpers.classCallCheck(this, _UserService);
                }

                babelHelpers.createClass(UserService, [{
                    key: "getRoomUsers",
                    value: function getRoomUsers(roomName) {
                        var config = {
                            params: { roomName: roomName }
                        };
                        return http().get('/getRoomUsers', config);
                    }
                }]);
                var _UserService = UserService;
                UserService = Service({ serviceName: 'userService' })(UserService) || UserService;
                return UserService;
            })();

            _export("default", UserService.instance);
        }
    };
});
//# sourceMappingURL=../../sourcemaps/app/chatRoom/userService.js.map
