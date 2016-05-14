System.register([], function (_export) {
    /**
     * Created by Alexandru on 01/03/16.
     */
    "use strict";

    var User;
    return {
        setters: [],
        execute: function () {
            User = (function () {
                function User() {
                    babelHelpers.classCallCheck(this, User);
                }

                babelHelpers.createClass(User, [{
                    key: "setCredentials",
                    value: function setCredentials(username, password) {
                        this.username = username;
                        this.password = password;
                    }
                }]);
                return User;
            })();

            _export("default", User);
        }
    };
});
//# sourceMappingURL=../../../sourcemaps/app/commons/model/user.js.map
