System.register(["/ngDecorators", "/commons/socketService", "webrtc-adapter", "./externalServices", "/commons/authService"], function (_export) {
    /**
     * Created by Alexandru on 29/02/16.
     */
    "use strict";

    var Service, socketService, adapter, window, authService, PeerService;
    return {
        setters: [function (_ngDecorators) {
            Service = _ngDecorators.Service;
        }, function (_commonsSocketService) {
            socketService = _commonsSocketService["default"];
        }, function (_webrtcAdapter) {
            adapter = _webrtcAdapter["default"];
        }, function (_externalServices) {
            window = _externalServices.window;
        }, function (_commonsAuthService) {
            authService = _commonsAuthService["default"];
        }],
        execute: function () {
            PeerService = (function () {
                function PeerService() {
                    babelHelpers.classCallCheck(this, _PeerService);
                }

                babelHelpers.createClass(PeerService, [{
                    key: "connect",
                    value: function connect(remoteStreamHandler) {
                        this.peer = new RTCPeerConnection(null);
                        this.peer.onicecandidate = this.iceCandidateLocal.bind(this);
                        this.remotePeer = new RTCPeerConnection(null);
                        this.remotePeer.onaddstream = remoteStreamHandler;
                        this.remotePeer.onicecandidate = this.iceCandidateRemote.bind(this);
                        this.subscribeToOffer(this.gotOffer.bind(this));
                        this.sdpConstraints = { 'mandatory': {
                                'OfferToReceiveAudio': true,
                                'OfferToReceiveVideo': true } };
                    }
                }, {
                    key: "iceCandidateRemote",
                    value: function iceCandidateRemote(event) {
                        if (event.candidate) {
                            this.peer.addIceCandidate(new RTCIceCandidate(event.candidate));
                        }
                    }
                }, {
                    key: "iceCandidateLocal",
                    value: function iceCandidateLocal(event) {
                        if (event.candidate) {
                            this.remotePeer.addIceCandidate(new RTCIceCandidate(event.candidate));
                        }
                    }
                }, {
                    key: "gotOffer",
                    value: function gotOffer(data) {
                        console.log("got offer");
                        data = JSON.parse(data.body);
                        this.rtcSessionDesc = new RTCSessionDescription();
                        this.rtcSessionDesc.type = "offer";
                        this.rtcSessionDesc.sdp = data.sdpDescription;
                        this.remotePeer.setLocalDescription(this.rtcSessionDesc);
                        this.peer.setRemoteDescription(this.rtcSessionDesc);
                        this.answer(data.id);
                    }
                }, {
                    key: "gotAnswer",
                    value: function gotAnswer(data) {
                        console.log("got Answer");
                        data = JSON.parse(data.body);
                        var rtcSessionDesc = new RTCSessionDescription();
                        rtcSessionDesc.type = "answer";
                        rtcSessionDesc.sdp = data.sdpDescription;
                        this.remotePeer.setLocalDescription(rtcSessionDesc);
                        this.peer.setRemoteDescription(rtcSessionDesc);
                    }
                }, {
                    key: "getUserMedia",
                    value: function getUserMedia() {
                        return window().navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    }
                }, {
                    key: "setLocalStream",
                    value: function setLocalStream(localstream) {
                        this.peer.addStream(localstream);
                    }
                }, {
                    key: "sendMessage",
                    value: function sendMessage(text) {}
                }, {
                    key: "call",
                    value: function call(username) {
                        var _this = this;

                        /*
                        this.peer.sendOffer(this.offerHandler);
                        */
                        this.peer.sendOffer().then(function (offer) {
                            return _this.offerHandler(offer, username);
                        });
                    }
                }, {
                    key: "answer",
                    value: function answer(username) {
                        var _this2 = this;

                        /*
                        this.peer.createAnswer(function(desc){
                            this.handlerReceiveAnswer(desc, username)
                        }.bind(this), this.handleError);
                        */
                        this.peer.createAnswer().then(function (offer) {
                            return _this2.answerHandler(offer, username);
                        });
                    }
                }, {
                    key: "offerHandler",
                    value: function offerHandler(desc, username) {
                        console.log("creating SDP offer");
                        console.log("sdp : " + desc.sdp);
                        this.peer.setLocalDescription(desc);
                        this.remotePeer.setRemoteDescription(desc);
                        socketService().send({ id: authService().getUsername(), type: 'offer', sdpDescription: desc.sdp, destUsername: username });
                        this.subscribeToAnswer(this.gotAnswer.bind(this));
                    }
                }, {
                    key: "answerHandler",
                    value: function answerHandler(desc, username) {
                        console.log("creating SDP offer");
                        this.peer.setLocalDescription(desc);
                        this.remotePeer.setRemoteDescription(desc);
                        socketService().send({ id: authService().getUsername(), type: 'answer', sdpDescription: desc.sdp, destUsername: username });
                    }

                    //$q
                    //$q.all (merge promises)
                }, {
                    key: "subscribeToAnswer",
                    value: function subscribeToAnswer(handler) {
                        /**
                        return $q(function(succes, error){
                            socketService().subscribe("/topic/"+authService().getUsername()+"/sdpAnswer", success);
                        })*/
                        return socketService().subscribe("/topic/" + authService().getUsername() + "/sdpAnswer", handler);
                    }
                }, {
                    key: "subscribeToOffer",
                    value: function subscribeToOffer(handler) {
                        return socketService().subscribe("/topic/" + authService().getUsername() + "/sdpOffer", handler);
                    }
                }, {
                    key: "handleError",
                    value: function handleError(errmsg) {
                        console.log("handleError: " + errmsg);
                    }
                }]);
                var _PeerService = PeerService;
                PeerService = Service({ serviceName: 'peerService' })(PeerService) || PeerService;
                return PeerService;
            })();

            _export("default", PeerService.instance);
        }
    };
});
//# sourceMappingURL=../sourcemaps/commons/peerService.js.map
