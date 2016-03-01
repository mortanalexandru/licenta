import {Component, Inject} from '../ngDecorators';
import template from './videoChat.html!text';
import peerService from '/commons/peerService';
import {window, sce} from "commons/externalServices";
import socketService from '/commons/socketService';
import authService from '/commons/authService';

@Component({
    selector: 'videochat',
    template: template })
@Inject('$scope')
class VideoChat {
    constructor($scope) {
        this.scope = $scope;
        this.message = 'This is my homepage';
        peerService().getUserMedia().then(this.handleStream.bind(this));
    }

    handleStream(stream){
        this.localStreamObject = stream;
        this.scope.localStream = sce().trustAsResourceUrl(window().URL.createObjectURL(stream));
        this.scope.$apply();
        this.call();
    }

    call(){
        this.peer = new RTCPeerConnection(null);
        this.peer.onicecandidate = this.iceCallback;
        this.peer.createOffer(this.gotDescription1.bind(this), this.handleError);
    }


    handleError(errmsg) {
        console.log(errmsg);
    }

    iceCallback(event){
        console.log("in function iceCallback1()");
        if (event.candidate) {
            this.peer.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    }

    gotDescription1(desc){
        console.log("creating SDP offer");
        this.peer.setLocalDescription(desc);
        var v=desc.sdp.split("\n");
        var sdp="";
        for(let i=0; i<v.length-1; i++) {
         sdp += v[i] + "--***--";
        }
        console.log(sdp);
        socketService().send({id:authService().getUsername(),sdpDescription:sdp});
}

}

export default VideoChat;