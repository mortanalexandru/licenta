import {Component, Inject, Secured} from '../ngDecorators';
import template from './chatRoom.html!text';
import {http, q, window, sce} from "commons/externalServices";
import socketService from '/commons/socketService';
import authService from '/commons/authService';
import userService from './userService';
import adapter from "webrtc-adapter";


@Component({
    selector: 'chatroom',
    template: template
})
@Inject('$scope', '$stateParams')
class ChatRoom{



    constructor($scope, $stateParams) {
        this.configuration = {
            iceServers: [{
                url: 'stun:23.21.150.121'
            }
            ]
        };

        this.scope = $scope;
        this.scope.streams = {};
        this.stateParams = $stateParams;
        this.roomName = $stateParams.roomName;
        this.scope.roomName = $stateParams.roomName;
        this.username = authService().getUsername();
        this.peers = {};
        this.users = [];
        this.host = false;

        this.subscribeToParticipationRequest(this.messageHandler.bind(this));

        if(authService().getUsername()){
            //assign username
            this.username = authService().getUsername();
            this.getLocalStream().then(this.handleStream.bind(this));
        }else{
            this.username="guest";
            //assign a random name
            this.initParticipant();
        }

    }


    handleReceiveIceCandidate(data){
        console.log("got ice" + data);
        if(this.peers[data.username]){
            this.peers[data.username].localPeer.addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)));
        }
    }

    initParticipant(){
        this.subscribeToOffer(this.messageHandler.bind(this));
        socketService().send("/app/chat/join",{type:"join", username:this.username, room: this.roomName});
    }

    getLocalStream(){
        return window().navigator.mediaDevices.getUserMedia({video:true, audio:false});
    }



    handleStream(stream) {
        this.localStreamObject = stream;
        this.scope.localStream = sce().trustAsResourceUrl(window().URL.createObjectURL(stream));
        this.scope.streams[this.username] = sce().trustAsResourceUrl(window().URL.createObjectURL(stream));
        this.scope.$apply();
        this.initParticipant();
    }

    subscribeToOffer(handler){
        return socketService().subscribe("/message/"+this.username, handler, "handshake");
    }

    receiveOffer(data){
        console.log("got offer");
        let peer = new RTCPeerConnection(this.configuration);
        let rtcSessionDesc = new RTCSessionDescription();
        rtcSessionDesc.type = "offer";
        rtcSessionDesc.sdp = data.sdpDescription;
        peer.setRemoteDescription(rtcSessionDesc);
        if(this.localStreamObject){
            peer.addStream(this.localStreamObject)
        }
        peer.onicecandidate = function(event){this.iceCandidateLocal(event, data.username)}.bind(this)


        peer.onaddstream = function(e){this.handleRemoteStream(e, data.username)}.bind(this);
        peer.oniceconnectionstatechange = function(e){this.handlerIceConnectionChanged(e, data.username)}.bind(this);


        this.peers[data.username] = {localPeer: peer, remotePeer: null};

        peer.createAnswer()
            .then(answer => this.sendAnswer(answer, data.username));
    }


    sendAnswer(desc, username){
        console.log("creating SDP answer");
        console.log("sdp : "+desc.sdp);
        this.peers[username].localPeer.setLocalDescription(desc);
        socketService().send("/app/chat/handshake", {username:this.username, type: 'answer', sdpDescription:desc.sdp, room: this.roomName, destUsername: username});
    }


    initHost(){
        socketService().subscribe("/message/"+this.username, this.messageHandler.bind(this));
    }


    subscribeToParticipationRequest(handler){
        return socketService().subscribe("/message/"+this.roomName, handler);
    }

    createAndSendOffer(response) {
        if (!response.host && response.username != this.username){
            let peer = new RTCPeerConnection(this.configuration);
            if(this.localStreamObject) {
                peer.addStream(this.localStreamObject)
            }
            peer.onicecandidate = function(event){this.iceCandidateLocal(event, response.username)}.bind(this)
            peer.onaddstream = function(e){this.handleRemoteStream(e, response.username)}.bind(this);
            peer.oniceconnectionstatechange = function(e){this.handlerIceConnectionChanged(e, response.username)}.bind(this);


            this.peers[response.username] = {localPeer: peer, remotePeer: null};
            peer.createOffer()
            .then(offer => this.createOffer(offer, response.username));
        }
    }


    handleRemoteStream(e, username) {
        this.host = true;
        this.scope.remoteStream = sce().trustAsResourceUrl(window().URL.createObjectURL(e.stream));
        this.scope.streams[username] = sce().trustAsResourceUrl(window().URL.createObjectURL(e.stream));
        this.scope.$apply();
    }

    handlerIceConnectionChanged(e, username){
        if(this.peers[username].localPeer.iceConnectionState == 'disconnected') {
            delete this.scope.streams[username];
            this.scope.$apply();
        }
    }


    createOffer(desc, username){
        console.log("creating SDP offer");
        console.log("sdp : "+desc.sdp);
        this.peers[username].localPeer.setLocalDescription(desc);
        socketService().send("/app/chat/handshake", {username:this.username, type: 'offer', sdpDescription:desc.sdp, room: this.roomName, destUsername: username});
    }

    subscribeToAnswer(handler){
        return socketService().subscribe("/message/"+this.username, handler);
    }

    answerHandler(data){
        console.log("got Answer");
        let sdp = data.sdpDescription;
        console.log("sdp "+sdp);
        let rtcSessionDesc = new RTCSessionDescription();
        rtcSessionDesc.type = "answer";
        rtcSessionDesc.sdp = sdp;
        this.peers[data.username].localPeer.setRemoteDescription(rtcSessionDesc)
    }


    subscribeToRoom(roomName, handler){
        socketService().subscribe("/app/room", handler, "room");
    }


    iceCandidateLocal(event, username){
        if (event.candidate) {
            socketService().send("/app/chat/ice", {type:"ice", username:this.username, candidate:JSON
                .stringify(event.candidate), room: this.roomName, destUsername: username});
        }
    }

    messageHandler(data){
        data = JSON.parse(data.body);
        switch (data.type) {
            case "offer":
                this.receiveOffer(data);
                break;
            case "join":
                if (data.username != this.username){
                    this.users.push(data.username);
                    if (this.host) {
                        this.createAndSendOffer(data);
                    }
                }else{
                    this.host = data.host;
                }
                break;
            case "ice":
                this.handleReceiveIceCandidate(data);
                break;
            case "answer":
                this.answerHandler(data);
                break;

        }
    }
}

export default ChatRoom;