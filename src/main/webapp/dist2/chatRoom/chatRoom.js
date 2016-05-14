System.register(['../ngDecorators', './chatRoom.html!text', 'commons/externalServices', '/commons/socketService', '/commons/authService', 'webrtc-adapter'], function (_export) {
    'use strict';

    var Component, Inject, Secured, template, q, window, sce, socketService, authService, adapter, ChatRoom;
    return {
        setters: [function (_ngDecorators) {
            Component = _ngDecorators.Component;
            Inject = _ngDecorators.Inject;
            Secured = _ngDecorators.Secured;
        }, function (_chatRoomHtmlText) {
            template = _chatRoomHtmlText['default'];
        }, function (_commonsExternalServices) {
            q = _commonsExternalServices.q;
            window = _commonsExternalServices.window;
            sce = _commonsExternalServices.sce;
        }, function (_commonsSocketService) {
            socketService = _commonsSocketService['default'];
        }, function (_commonsAuthService) {
            authService = _commonsAuthService['default'];
        }, function (_webrtcAdapter) {
            adapter = _webrtcAdapter['default'];
        }],
        execute: function () {
            ChatRoom = (function () {
                function ChatRoom($scope, $stateParams) {
                    babelHelpers.classCallCheck(this, _ChatRoom);

                    this.scope = $scope;
                    this.scope.streams = {};
                    this.roomName = $stateParams.roomName;
                    this.scope.roomName = $stateParams.roomName;
                    this.peers = {};
                    this.scope.users = [];
                    this.host = false;
                    this.guest = false;

                    //determine if guest or not
                    if (authService().getUsername()) {
                        this.username = authService().getUsername();
                    } else {
                        this.username = this.getRandomId();
                        this.guest = true;
                    }

                    socketService().connect(this.username, this.roomName).then(this.initUser.bind(this));
                }

                babelHelpers.createClass(ChatRoom, [{
                    key: 'initUser',
                    value: function initUser() {
                        this.subscribeToRoom(this.messageHandler.bind(this));
                        if (this.guest) {
                            this.joinRoom();
                        } else {
                            this.getLocalStream().then(this.handleLocalStream.bind(this));
                        }
                    }
                }, {
                    key: 'subscribeToRoom',
                    value: function subscribeToRoom(handler) {
                        return socketService().subscribe("/message/" + this.roomName, handler);
                    }
                }, {
                    key: 'joinRoom',
                    value: function joinRoom() {
                        this.subscribeToUsername(this.messageHandler.bind(this));
                        socketService().send("/app/chat/join", { type: "join", username: this.username, room: this.roomName, guest: this.guest });
                    }
                }, {
                    key: 'getLocalStream',
                    value: function getLocalStream() {
                        return window().navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    }
                }, {
                    key: 'handleLocalStream',
                    value: function handleLocalStream(stream) {
                        this.localStreamObject = stream;
                        this.scope.streams[this.username] = sce().trustAsResourceUrl(window().URL.createObjectURL(stream));
                        this.scope.$apply();
                        this.joinRoom();
                    }
                }, {
                    key: 'handleReceiveIceCandidate',
                    value: function handleReceiveIceCandidate(data) {
                        if (this.peers[data.username]) {
                            this.peers[data.username].addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)));
                        }
                    }
                }, {
                    key: 'subscribeToUsername',
                    value: function subscribeToUsername(handler) {
                        return socketService().subscribe("/message/" + this.username, handler, "handshake");
                    }
                }, {
                    key: 'handleReceiveOffer',
                    value: function handleReceiveOffer(data) {
                        var _this = this;

                        var peer = new RTCPeerConnection(this.configuration);
                        var rtcSessionDesc = new RTCSessionDescription();
                        rtcSessionDesc.type = "offer";
                        rtcSessionDesc.sdp = data.sdpDescription;
                        peer.setRemoteDescription(rtcSessionDesc);
                        if (this.localStreamObject) {
                            peer.addStream(this.localStreamObject);
                        }
                        peer.onicecandidate = (function (event) {
                            this.sendLocalIceCandidates(event, data.username);
                        }).bind(this);
                        peer.onaddstream = (function (e) {
                            this.handleRemoteStream(e, data.username);
                        }).bind(this);
                        peer.oniceconnectionstatechange = (function (e) {
                            this.handlerIceConnectionChanged(e, data.username);
                        }).bind(this);
                        this.peers[data.username] = peer;
                        peer.createAnswer().then(function (answer) {
                            return _this.sendAnswer(answer, data.username);
                        });
                    }
                }, {
                    key: 'sendAnswer',
                    value: function sendAnswer(desc, username) {
                        this.peers[username].setLocalDescription(desc);
                        socketService().send("/app/chat/handshake", { username: this.username, type: 'answer', sdpDescription: desc.sdp, room: this.roomName, destUsername: username });
                    }
                }, {
                    key: 'createAndSendOffer',
                    value: function createAndSendOffer(response) {
                        var peer = new RTCPeerConnection(this.configuration);
                        if (this.localStreamObject) {
                            peer.addStream(this.localStreamObject);
                        }
                        peer.onicecandidate = (function (event) {
                            this.sendLocalIceCandidates(event, response.username);
                        }).bind(this);
                        peer.onaddstream = (function (e) {
                            this.handleRemoteStream(e, response.username);
                        }).bind(this);
                        peer.oniceconnectionstatechange = (function (e) {
                            this.handlerIceConnectionChanged(e, response.username);
                        }).bind(this);
                        this.peers[response.username] = peer;
                        // peer.createOffer().then(offer => this.sendOffer(offer, response.username));
                        peer.createOffer((function (offer) {
                            this.sendOffer(offer, response.username);
                        }).bind(this));
                    }
                }, {
                    key: 'sendOffer',
                    value: function sendOffer(desc, username) {
                        this.peers[username].setLocalDescription(desc);
                        socketService().send("/app/chat/handshake", { username: this.username, type: 'offer', sdpDescription: desc.sdp, room: this.roomName, destUsername: username });
                    }
                }, {
                    key: 'handleRemoteStream',
                    value: function handleRemoteStream(e, username) {
                        this.host = true;
                        this.scope.streams[username] = sce().trustAsResourceUrl(window().URL.createObjectURL(e.stream));
                        this.scope.$apply();
                    }
                }, {
                    key: 'handlerIceConnectionChanged',
                    value: function handlerIceConnectionChanged(e, username) {
                        if (this.peers[username].iceConnectionState == 'disconnected') {
                            delete this.scope.streams[username];
                            this.scope.$apply();
                            socketService().send("/app/chat/leave", { type: "leave", username: username, room: this.roomName });
                            this.removeUser(username);
                        }
                    }
                }, {
                    key: 'removeUser',
                    value: function removeUser(user) {
                        var index = this.scope.users.indexOf(user);
                        if (index >= 0) {
                            this.scope.users.splice(index, 1);
                        }
                        this.scope.$apply();
                    }
                }, {
                    key: 'addUser',
                    value: function addUser(user) {
                        if (this.scope.users.indexOf(user) < 0) {
                            this.scope.users.push(user);
                            this.scope.$apply();
                        }
                    }
                }, {
                    key: 'handlerReceiveAnswer',
                    value: function handlerReceiveAnswer(data) {
                        console.log("got Answer");
                        var sdp = data.sdpDescription;
                        console.log("sdp " + sdp);
                        var rtcSessionDesc = new RTCSessionDescription();
                        rtcSessionDesc.type = "answer";
                        rtcSessionDesc.sdp = sdp;
                        this.peers[data.username].setRemoteDescription(rtcSessionDesc);
                    }
                }, {
                    key: 'sendLocalIceCandidates',
                    value: function sendLocalIceCandidates(event, username) {
                        if (event.candidate) {
                            socketService().send("/app/chat/ice", { type: "ice", username: this.username, candidate: JSON.stringify(event.candidate), room: this.roomName, destUsername: username });
                        }
                    }
                }, {
                    key: 'requestOffer',
                    value: function requestOffer(username) {
                        socketService().send("/app/chat/handshake", { type: "requestOffer", username: this.username, sdpDescription: null, room: this.roomName, destUsername: username });
                    }
                }, {
                    key: 'handleUserJoined',
                    value: function handleUserJoined(data) {
                        if (this.guest && !data.guest) {
                            this.requestOffer(data.username);
                        }
                        if (this.host && !this.guest) {
                            this.createAndSendOffer(data);
                        }
                        this.addUser(data.username);
                    }
                }, {
                    key: 'messageHandler',
                    value: function messageHandler(data) {
                        data = JSON.parse(data.body);
                        switch (data.type) {
                            case "offer":
                                this.handleReceiveOffer(data);
                                break;
                            case "join":
                                if (data.username != this.username) {
                                    this.handleUserJoined(data);
                                } else {
                                    this.host = data.host;
                                }
                                break;
                            case "ice":
                                this.handleReceiveIceCandidate(data);
                                break;
                            case "answer":
                                this.handlerReceiveAnswer(data);
                                break;
                            case "requestOffer":
                                this.addUser(data.username);
                                this.createAndSendOffer(data);
                                break;
                        }
                    }
                }, {
                    key: 'getRandomId',
                    value: function getRandomId() {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 5; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return text;
                    }
                }]);
                var _ChatRoom = ChatRoom;
                ChatRoom = Inject('$scope', '$stateParams')(ChatRoom) || ChatRoom;
                ChatRoom = Component({
                    selector: 'chatroom',
                    template: template
                })(ChatRoom) || ChatRoom;
                return ChatRoom;
            })();

            _export('default', ChatRoom);
        }
    };
});
//# sourceMappingURL=../../sourcemaps/app/chatRoom/chatRoom.js.map
