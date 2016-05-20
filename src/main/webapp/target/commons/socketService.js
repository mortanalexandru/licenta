System.register(["../ngDecorators", "sockjs-client", "stompjs", "./externalServices", "./authService"], function (_export) {
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
        }, function (_authService) {
            authService = _authService["default"];
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
                                this.stompClient.heartbeat.outgoing = 2000;
                                this.stompClient.heartbeat.incoming = 2000;
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
                    key: "connectToSearchSocket",
                    value: function connectToSearchSocket() {
                        if (!this.connectingPromiseSearch) {
                            this.connectingPromiseSearch = q()((function (resolve, reject) {
                                this.socketSearch = new Socket('/searchRooms');
                                this.stompClientSearch = Stomp.over(this.socketSearch);
                                this.stompClientSearch.heartbeat.outgoing = 2000;
                                this.stompClientSearch.heartbeat.incoming = 2000;
                                this.stompClientSearch.connect({}, (function () {
                                    this.connectingPromiseSearch = null;
                                    this.connectedSearch = true;
                                    resolve();
                                }).bind(this));
                            }).bind(this));
                        }
                        return this.connectingPromiseSearch;
                    }
                }, {
                    key: "subscribeToSearch",
                    value: function subscribeToSearch(url, handler, id) {
                        if (!this.connectedSearch) {
                            this.connectToSearchSocket().then((function () {
                                this.stompClientSearch.subscribe(url, handler);
                            }).bind(this));
                        } else {
                            return this.stompClientSearch.subscribe(url, handler);
                        }
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
                    value: function subscribe(url, handler) {
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
                }, {
                    key: "sendSearch",
                    value: function sendSearch(path, object) {
                        if (!this.connectedSearch) {
                            this.connectToSearchSocket().then((function () {
                                this.stompClientSearch.send(path, {}, JSON.stringify(object));
                            }).bind(this));
                        } else {
                            return this.stompClientSearch.send(path, {}, JSON.stringify(object));
                        }
                    }
                }, {
                    key: "disconnect",
                    value: function disconnect() {
                        this.socket.close();
                        this.stompClient.disconnect();
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
//# sourceMappingURL=../sourcemaps/commons/socketService.js.map
