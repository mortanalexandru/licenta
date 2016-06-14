System.register(['../ngDecorators', './chatRoom.html!text', '../commons/externalServices', '../commons/socketService', '../commons/authService', 'webrtc-adapter', './chatRoom.css!'], function (_export) {
    'use strict';

    var Component, Inject, Secured, template, q, window, sce, state, socketService, authService, adapter, ChatRoom;
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
            state = _commonsExternalServices.state;
        }, function (_commonsSocketService) {
            socketService = _commonsSocketService['default'];
        }, function (_commonsAuthService) {
            authService = _commonsAuthService['default'];
        }, function (_webrtcAdapter) {
            adapter = _webrtcAdapter['default'];
        }, function (_chatRoomCss) {}],
        execute: function () {
            ChatRoom = (function () {
                function ChatRoom($scope, $stateParams) {
                    babelHelpers.classCallCheck(this, _ChatRoom);

                    this.configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
                    this.scope = $scope;
                    this.scope.streams = {};
                    this.roomName = $stateParams.roomName || "default";
                    this.scope.roomName = $stateParams.roomName;
                    this.peers = {};
                    this.scope.users = [];
                    this.host = false;
                    this.guest = false;
                    this.dataChannels = {};
                    this.scope.messages = [];
                    this.scope.streamNumber = 0;
                    this.scope.chatOpenClass = "";
                    this.scope.displayVideo = this.video;
                    this.scope.displayTextChat = this.text;

                    if (!this.standalone) {
                        this.handleLeavePageDisconnect();
                    }

                    //determine if guest or not
                    if (authService().getUsername()) {
                        this.username = authService().getUsername();
                    } else {
                        this.username = this.getRandomId();
                        this.guest = true;
                    }

                    if (this.standalone) {
                        var username = this.getUrlParameter("username");
                        if (username != null) {
                            this.username = username;
                            this.guest = false;
                        }
                    }

                    socketService().connect(this.username, this.roomName).then(this.initUser.bind(this));
                }

                babelHelpers.createClass(ChatRoom, [{
                    key: 'handleLeavePageDisconnect',
                    value: function handleLeavePageDisconnect() {
                        this.scope.$on('$stateChangeStart', (function (event, newState, newParam, oldState, oldParam) {
                            socketService().disconnect();
                            console.log("Disconected socket");
                        }).bind(this));
                    }
                }, {
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
                        socketService().send("/app/chat/join", {
                            type: "join",
                            username: this.username,
                            room: this.roomName,
                            guest: this.guest
                        });
                    }
                }, {
                    key: 'getLocalStream',
                    value: function getLocalStream() {
                        return window().navigator.mediaDevices.getUserMedia({
                            video: { width: 500, height: 500 }, audio: this.audio
                        });
                    }
                }, {
                    key: 'handleLocalStream',
                    value: function handleLocalStream(stream) {
                        this.localStreamObject = stream;
                        this.scope.streams[this.username] = sce().trustAsResourceUrl(window().URL.createObjectURL(stream));
                        this.scope.streamNumber++;
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
                        peer.onaddstream = (function (e) {
                            this.handleRemoteStream(e, data.username);
                        }).bind(this);
                        peer.oniceconnectionstatechange = (function (e) {
                            this.handlerIceConnectionChanged(e, data.username);
                        }).bind(this);
                        this.peers[data.username] = peer;
                        this.dataChannels[data.username] = peer.createDataChannel("chat");

                        this.createDataChannel(peer, data.username);

                        peer.createAnswer().then(function (answer) {
                            return _this.sendAnswer(answer, data.username);
                        });
                        peer.onicecandidate = (function (event) {
                            this.sendLocalIceCandidates(event, data.username);
                        }).bind(this);
                    }
                }, {
                    key: 'handlerIceConnectionChanged',
                    value: function handlerIceConnectionChanged(e, username) {
                        if (this.peers[username] && this.peers[username].iceConnectionState == 'disconnected') {
                            delete this.scope.streams[username];
                            this.scope.$apply();
                            this.removeUser(username);
                        }
                    }
                }, {
                    key: 'sendAnswer',
                    value: function sendAnswer(desc, username) {
                        this.peers[username].setLocalDescription(desc);
                        socketService().send("/app/chat/handshake", {
                            username: this.username,
                            type: 'answer',
                            sdpDescription: desc.sdp,
                            room: this.roomName,
                            destUsername: username
                        });
                    }
                }, {
                    key: 'createAndSendOffer',
                    value: function createAndSendOffer(response) {
                        var peer = new RTCPeerConnection(this.configuration);
                        if (this.localStreamObject) {
                            peer.addStream(this.localStreamObject);
                        }
                        peer.onaddstream = (function (e) {
                            this.handleRemoteStream(e, response.username);
                        }).bind(this);
                        peer.oniceconnectionstatechange = (function (e) {
                            this.handlerIceConnectionChanged(e, response.username);
                        }).bind(this);
                        this.peers[response.username] = peer;

                        this.createDataChannel(peer, response.username);

                        // peer.createOffer().then(offer => this.sendOffer(offer, response.username));
                        peer.createOffer((function (offer) {
                            this.sendOffer(offer, response.username);
                        }).bind(this), function () {
                            console.log("there was an error creating the offer");
                        });
                    }
                }, {
                    key: 'createDataChannel',
                    value: function createDataChannel(peer, username) {
                        this.dataChannels[username] = {};
                        this.dataChannels[username].sendChannel = peer.createDataChannel("chat");
                        peer.ondatachannel = (function (event) {
                            this.dataChannels[username].receiveChannel = event.channel;
                            this.dataChannels[username].receiveChannel.onmessage = (function (event) {
                                this.handleChatMessageReceived(username, event.data);
                            }).bind(this);
                        }).bind(this);
                    }
                }, {
                    key: 'handleChatMessageReceived',
                    value: function handleChatMessageReceived(username, message) {
                        message = JSON.parse(message);
                        if (!message.broadcast || this.guest) {
                            if (!message.broadcast || !this.checkIfMessageAlreadyAdded(message.id)) {
                                if (message.broadcast) {
                                    username = message.username;
                                }
                                this.scope.messages.push({ id: message.id, user: username, message: message.message, self: false });
                                this.scope.$apply();
                            }
                        }
                        if (message.guest && !this.guest) {
                            message.broadcast = true;
                            this.sendMessage(message.message, true, message);
                        }
                    }
                }, {
                    key: 'checkIfMessageAlreadyAdded',
                    value: function checkIfMessageAlreadyAdded(id) {
                        for (var i = 0; i < this.scope.messages.length; i++) {
                            if (this.scope.messages[i].id == id) {
                                return true;
                            }
                        }
                        return false;
                    }
                }, {
                    key: 'sendOffer',
                    value: function sendOffer(desc, username) {
                        this.peers[username].setLocalDescription(desc);
                        socketService().send("/app/chat/handshake", {
                            username: this.username,
                            type: 'offer',
                            sdpDescription: desc.sdp,
                            room: this.roomName,
                            destUsername: username
                        });
                    }
                }, {
                    key: 'handleRemoteStream',
                    value: function handleRemoteStream(e, username) {
                        this.host = true;
                        this.scope.streams[username] = sce().trustAsResourceUrl(window().URL.createObjectURL(e.stream));
                        this.scope.streamNumber++;
                        this.scope.$apply();
                    }
                }, {
                    key: 'handlerUserLeft',
                    value: function handlerUserLeft(username) {
                        delete this.scope.streams[username];
                        this.scope.$apply();
                        this.removeUser(username);
                    }
                }, {
                    key: 'removeUser',
                    value: function removeUser(user) {
                        var index = this.scope.users.indexOf(user);
                        if (index >= 0) {
                            this.scope.users.splice(index, 1);
                        }
                        delete this.peers[user];
                        delete this.dataChannels[user];
                        this.scope.$apply();
                    }
                }, {
                    key: 'addUser',
                    value: function addUser(user) {
                        if (this.scope.users.indexOf(user) < 0 && this.username != user) {
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
                        this.peers[data.username].onicecandidate = (function (event) {
                            this.sendLocalIceCandidates(event, data.username);
                        }).bind(this);
                    }
                }, {
                    key: 'sendLocalIceCandidates',
                    value: function sendLocalIceCandidates(event, username) {
                        if (event.candidate) {
                            socketService().send("/app/chat/ice", {
                                type: "ice", username: this.username, candidate: JSON.stringify(event.candidate), room: this.roomName, destUsername: username
                            });
                        }
                    }
                }, {
                    key: 'requestOffer',
                    value: function requestOffer(username) {
                        socketService().send("/app/chat/handshake", {
                            type: "requestOffer",
                            username: this.username,
                            sdpDescription: null,
                            room: this.roomName,
                            destUsername: username
                        });
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
                                this.addUser(data.username);
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
                                this.addUser(data.username);
                                this.handlerReceiveAnswer(data);
                                break;
                            case "requestOffer":
                                this.addUser(data.username);
                                this.createAndSendOffer(data);
                                break;
                            case "userLeft":
                                this.handlerUserLeft(data.username);
                                break;
                            case "userJoined":
                                this.addUser(data.username);
                                break;
                            case "onlineUsers":
                                for (var i = 0; i < data.onlineUsers.length; i++) {
                                    this.addUser(data.onlineUsers[i]);
                                }
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
                        return "guest" + text;
                    }
                }, {
                    key: 'sendMessage',
                    value: function sendMessage(message, broadcast, originalMessage) {
                        var id = this.getRandomId();
                        for (var key in this.dataChannels) {
                            if (!this.dataChannels.hasOwnProperty(key)) continue;
                            var json = JSON.stringify(originalMessage);
                            if (!broadcast) {
                                json = JSON.stringify({ id: id, guest: this.guest, broadcast: false, message: message, username: this.username });
                            }
                            this.dataChannels[key].sendChannel.send(json);
                        }
                        if (!broadcast) {
                            this.scope.messages.push({ id: id, user: this.username, message: message, self: true });
                            this.scope.message = "";
                        }
                    }
                }, {
                    key: 'toggleChat',
                    value: function toggleChat() {
                        if (this.scope.chatOpenClass == "") {
                            this.scope.chatOpenClass = "open";
                        } else {
                            this.scope.chatOpenClass = "";
                        }
                    }
                }, {
                    key: 'getUrlParameter',
                    value: function getUrlParameter(name, url) {
                        if (!url) url = window().location.href;
                        name = name.replace(/[\[\]]/g, "\\$&");
                        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                            results = regex.exec(url);
                        if (!results) return null;
                        if (!results[2]) return '';
                        return decodeURIComponent(results[2].replace(/\+/g, " "));
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
//# sourceMappingURL=../sourcemaps/chatRoom/chatRoom.js.map
