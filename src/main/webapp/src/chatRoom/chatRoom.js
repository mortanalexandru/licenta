import {Component, Inject, Secured} from '../ngDecorators';
import template from './chatRoom.html!text';
import {q, window, sce, state} from "../commons/externalServices";
import socketService from '../commons/socketService';
import authService from '../commons/authService';
import adapter from "webrtc-adapter";
import './chatRoom.css!';

@Component({
    selector: 'chatroom',
    template: template
})
@Inject('$scope', '$stateParams')
class ChatRoom {

    constructor($scope, $stateParams) {
        this.configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
        this.scope = $scope;
        this.scope.streams = {};
        this.roomName = $stateParams.roomName;
        this.scope.roomName = $stateParams.roomName;
        this.peers = {};
        this.scope.users = [];
        this.host = false;
        this.guest = false;
        this.dataChannels = {};
        this.scope.messages = [];
        this.scope.streamNumber = 0;
        this.scope.chatOpenClass = "";


        this.handleLeavePageDisconnect();

        //determine if guest or not
        if (authService().getUsername()) {
            this.username = authService().getUsername();
        } else {
            this.username = this.getRandomId();
            this.guest = true;
        }

        socketService().connect(this.username, this.roomName).then(this.initUser.bind(this));

    }


    handleLeavePageDisconnect() {
        this.scope.$on('$stateChangeStart', function (event, newState, newParam, oldState, oldParam) {
            socketService().disconnect();
            console.log("Disconected socket");
        }.bind(this));
    }

    initUser() {
        this.subscribeToRoom(this.messageHandler.bind(this));
        if (this.guest) {
            this.joinRoom();
        } else {
            this.getLocalStream().then(this.handleLocalStream.bind(this));
        }
    }


    subscribeToRoom(handler) {
        return socketService().subscribe("/message/" + this.roomName, handler);
    }

    joinRoom() {
        this.subscribeToUsername(this.messageHandler.bind(this));
        socketService().send("/app/chat/join", {
            type: "join",
            username: this.username,
            room: this.roomName,
            guest: this.guest
        });
    }

    getLocalStream() {
        return window().navigator.mediaDevices.getUserMedia({
            video: {width: 500, height: 500}, audio: false
        });
    }

    handleLocalStream(stream) {
        this.localStreamObject = stream;
        this.scope.streams[this.username] = sce().trustAsResourceUrl(window().URL.createObjectURL(stream));
        this.scope.streamNumber++;
        this.scope.$apply();
        this.joinRoom();
    }

    handleReceiveIceCandidate(data) {
        if (this.peers[data.username]) {
            this.peers[data.username].addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)));
        }
    }

    subscribeToUsername(handler) {
        return socketService().subscribe("/message/" + this.username, handler, "handshake");
    }

    handleReceiveOffer(data) {
        let peer = new RTCPeerConnection(this.configuration);
        let rtcSessionDesc = new RTCSessionDescription();
        rtcSessionDesc.type = "offer";
        rtcSessionDesc.sdp = data.sdpDescription;
        peer.setRemoteDescription(rtcSessionDesc);
        if (this.localStreamObject) {
            peer.addStream(this.localStreamObject)
        }
        peer.onaddstream = function (e) {
            this.handleRemoteStream(e, data.username)
        }.bind(this);
        peer.oniceconnectionstatechange = function (e) {
            this.handlerIceConnectionChanged(e, data.username)
        }.bind(this);
        this.peers[data.username] = peer;
        this.dataChannels[data.username] = peer.createDataChannel("chat");

        this.createDataChannel(peer, data.username);

        peer.createAnswer()
            .then(answer => this.sendAnswer(answer, data.username));
        peer.onicecandidate = function (event) {
            this.sendLocalIceCandidates(event, data.username)
        }.bind(this)
    }

    handlerIceConnectionChanged(e, username) {
        if (this.peers[username] && this.peers[username].iceConnectionState == 'disconnected') {
            delete this.scope.streams[username];
            this.scope.$apply();
            this.removeUser(username);
        }
    }

    sendAnswer(desc, username) {
        this.peers[username].setLocalDescription(desc);
        socketService().send("/app/chat/handshake", {
            username: this.username,
            type: 'answer',
            sdpDescription: desc.sdp,
            room: this.roomName,
            destUsername: username
        });
    }

    createAndSendOffer(response) {
        let peer = new RTCPeerConnection(this.configuration);
        if (this.localStreamObject) {
            peer.addStream(this.localStreamObject)
        }
        peer.onaddstream = function (e) {
            this.handleRemoteStream(e, response.username)
        }.bind(this);
        peer.oniceconnectionstatechange = function (e) {
            this.handlerIceConnectionChanged(e, response.username)
        }.bind(this);
        this.peers[response.username] = peer;

        this.createDataChannel(peer, response.username);

        // peer.createOffer().then(offer => this.sendOffer(offer, response.username));
        peer.createOffer(function (offer) {
            this.sendOffer(offer, response.username);
        }.bind(this), function () {
            console.log("there was an error creating the offer");
        })
    }


    createDataChannel(peer, username) {
        this.dataChannels[username] = {};
        this.dataChannels[username].sendChannel = peer.createDataChannel("chat");
        peer.ondatachannel = function (event) {
            this.dataChannels[username].receiveChannel = event.channel;
            this.dataChannels[username].receiveChannel.onmessage = function (event) {
                this.handleChatMessageReceived(username, event.data);
            }.bind(this);
        }.bind(this);
    }

    handleChatMessageReceived(username, message) {
        message = JSON.parse(message);
        if(!message.broadcast || this.guest) {
            if(!message.broadcast || !this.checkIfMessageAlreadyAdded(message.id)){
                if(message.broadcast){
                    username = message.username;
                }
                this.scope.messages.push({id: message.id, user: username, message: message.message, self: false});
                this.scope.$apply();
            }
        }
        if(message.guest && !this.guest){
            message.broadcast = true;
            this.sendMessage(message.message, true, message);
        }
    }

    checkIfMessageAlreadyAdded(id){
        for(let i=0; i<this.scope.messages.length; i++){
            if(this.scope.messages[i].id == id){
                return true;
            }
        }
        return false;
    }


    sendOffer(desc, username) {
        this.peers[username].setLocalDescription(desc);
        socketService().send("/app/chat/handshake", {
            username: this.username,
            type: 'offer',
            sdpDescription: desc.sdp,
            room: this.roomName,
            destUsername: username
        });
    }

    handleRemoteStream(e, username) {
        this.host = true;
        this.scope.streams[username] = sce().trustAsResourceUrl(window().URL.createObjectURL(e.stream));
        this.scope.streamNumber++;
        this.scope.$apply();
    }


    handlerUserLeft(username) {
        delete this.scope.streams[username];
        this.scope.$apply();
        this.removeUser(username);
    }

    removeUser(user) {
        var index = this.scope.users.indexOf(user);
        if (index >= 0) {
            this.scope.users.splice(index, 1);
        }
        delete this.peers[user];
        delete this.dataChannels[user];
        this.scope.$apply();
    }

    addUser(user) {
        if (this.scope.users.indexOf(user) < 0 && this.username != user) {
            this.scope.users.push(user);
            this.scope.$apply();
        }
    }

    handlerReceiveAnswer(data) {
        console.log("got Answer");
        let sdp = data.sdpDescription;
        console.log("sdp " + sdp);
        let rtcSessionDesc = new RTCSessionDescription();
        rtcSessionDesc.type = "answer";
        rtcSessionDesc.sdp = sdp;
        this.peers[data.username].setRemoteDescription(rtcSessionDesc)
        this.peers[data.username].onicecandidate = function (event) {
            this.sendLocalIceCandidates(event, data.username)
        }.bind(this);
    }

    sendLocalIceCandidates(event, username) {
        if (event.candidate) {
            socketService().send("/app/chat/ice", {
                type: "ice", username: this.username, candidate: JSON
                    .stringify(event.candidate), room: this.roomName, destUsername: username
            });
        }
    }

    requestOffer(username) {
        socketService().send("/app/chat/handshake", {
            type: "requestOffer",
            username: this.username,
            sdpDescription: null,
            room: this.roomName,
            destUsername: username
        });
    }

    handleUserJoined(data) {
        if (this.guest && !data.guest) {
            this.requestOffer(data.username);
        }
        if (this.host && !this.guest) {
            this.createAndSendOffer(data);
        }
        this.addUser(data.username);
    }

    messageHandler(data) {
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
                this.createAndSendOffer(data)
                break;
            case "userLeft":
                this.handlerUserLeft(data.username);
                break;
            case "userJoined":
                this.addUser(data.username);
                break;
            case "onlineUsers":
                for (let i = 0; i < data.onlineUsers.length; i++) {
                    this.addUser(data.onlineUsers[i]);
                }
                break;
        }
    }

    getRandomId() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return "guest" + text;
    }

    sendMessage(message, broadcast, originalMessage) {
        let id = this.getRandomId();
        for (let key in this.dataChannels) {
            if (!this.dataChannels.hasOwnProperty(key)) continue;
            let json = JSON.stringify(originalMessage);
            if(!broadcast){
                json = JSON.stringify({id: id, guest: this.guest, broadcast: false, message: message, username: this.username});
            }
            this.dataChannels[key].sendChannel.send(json);
        }
        if(!broadcast){
            this.scope.messages.push({id: id,user: this.username, message: message, self: true});
            this.scope.message = "";
        }
    }

    toggleChat(){
        if(this.scope.chatOpenClass == ""){
            this.scope.chatOpenClass = "open";
        }else{
            this.scope.chatOpenClass = "";
        }
    }


}

export default ChatRoom;