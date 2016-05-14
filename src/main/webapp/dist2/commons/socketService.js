System.register(["/ngDecorators", "sockjs-client", "stompjs", "./externalServices", "/commons/authService"], function (_export) {
    /**
     * Created by Alexandru on 29/02/16.
     */
    "use strict";

    var Service, Socket, Stomp, q, authService, SocketService;
    return {
        setters: [function (_ngDecorators) {
            Service = _ngDecorators.Service;
        }, function (_sockjsClient) {
            Socket = _sockjsClient["default"];
        }, function (_stompjs) {
            Stomp = _stompjs["default"];
        }, function (_externalServices) {
            q = _externalServices.q;
        }, function (_commonsAuthService) {
            authService = _commonsAuthService["default"];
        }],
        execute: function () {
            SocketService = (function () {
                function SocketService() {
                    babelHelpers.classCallCheck(this, _SocketService);
                    this.connected = false;
                }

                babelHelpers.createClass(SocketService, [{
                    key: "connect",
                    value: function connect(username, room) {
                        this.username = username;
                        this.room = room;
                        if (!this.connectingPromise) {
                            this.connectingPromise = q()((function (resolve, reject) {
                                this.socket = new Socket('/chat');
                                this.stompClient = Stomp.over(this.socket);
                                this.stompClient.connect({ user: username, room: room }, (function () {
                                    this.connectingPromise = null;
                                    this.connected = true;
                                    resolve();
                                }).bind(this));
                            }).bind(this));
                        }
                        return this.connectingPromise;
                    }
                }, {
                    key: "setConnected",
                    value: function setConnected(connected) {
                        this.connected = connected;
                    }
                }, {
                    key: "isConnected",
                    value: function isConnected() {
                        return this.connected;
                    }
                }, {
                    key: "subscribe",
                    value: function subscribe(url, handler, id) {
                        if (!this.connected) {
                            this.connect(this.username, this.room).then((function () {
                                this.username = authService().getUsername();
                                this.stompClient.subscribe(url, handler);
                            }).bind(this));
                        } else {
                            return this.stompClient.subscribe(url, handler);
                        }
                    }
                }, {
                    key: "send",
                    value: function send(path, object) {
                        if (!this.connected) {
                            this.connect(this.username, this.room).then((function () {
                                this.stompClient.send(path, {}, JSON.stringify(object));
                            }).bind(this));
                        } else {
                            return this.stompClient.send(path, {}, JSON.stringify(object));
                        }
                    }
                }]);
                var _SocketService = SocketService;
                SocketService = Service({ serviceName: 'socketService' })(SocketService) || SocketService;
                return SocketService;
            })();

            _export("default", SocketService.instance);
        }
    };
});
//# sourceMappingURL=../../sourcemaps/app/commons/socketService.js.map
