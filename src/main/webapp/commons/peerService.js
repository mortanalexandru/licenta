/**
 * Created by Alexandru on 29/02/16.
 */
import {Service} from "/ngDecorators"
import socketService from '/commons/socketService';
import adapter from "webrtc-adapter";
import {window} from "./externalServices"
import authService from '/commons/authService';

@Service({serviceName: 'peerService'})
class PeerService {

    constructor() {

    }


    connect(remoteStreamHandler){
        this.peer = new RTCPeerConnection(null);
        this.peer.onicecandidate = this.iceCandidateLocal.bind(this);
        this.remotePeer = new RTCPeerConnection(null);
        this.remotePeer.onaddstream = remoteStreamHandler;
        this.remotePeer.onicecandidate = this.iceCandidateRemote.bind(this);
        this.subscribeToOffer(this.gotOffer.bind(this));
        this.sdpConstraints = {'mandatory': {
            'OfferToReceiveAudio':true,
            'OfferToReceiveVideo':true }};
    }

    iceCandidateRemote(event){
        if (event.candidate) {
            this.peer.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    }

    iceCandidateLocal(event){
        if (event.candidate) {
            this.remotePeer.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    }

    gotOffer(data){
        console.log("got offer");
        data = JSON.parse(data.body);
        this.rtcSessionDesc = new RTCSessionDescription();
        this.rtcSessionDesc.type = "offer";
        this.rtcSessionDesc.sdp = data.sdpDescription;
        this.remotePeer.setLocalDescription(this.rtcSessionDesc);
        this.peer.setRemoteDescription(this.rtcSessionDesc)
        this.answer(data.id)
    }

    gotAnswer(data){
        console.log("got Answer");
        data = JSON.parse(data.body);
        let rtcSessionDesc = new RTCSessionDescription();
        rtcSessionDesc.type = "answer";
        rtcSessionDesc.sdp = data.sdpDescription;
        this.remotePeer.setLocalDescription(rtcSessionDesc);
        this.peer.setRemoteDescription(rtcSessionDesc)
    }

    getUserMedia(){
        return window().navigator.mediaDevices.getUserMedia({video:true, audio:false});
    }

    setLocalStream(localstream){
        this.peer.addStream(localstream);
    }

    sendMessage(text) {

    }

    call(username){
        /*
        this.peer.sendOffer(this.offerHandler);
*/
       this.peer.sendOffer()
            .then(offer => this.offerHandler(offer, username));
    }

    answer(username){
        /*
        this.peer.createAnswer(function(desc){
            this.handlerReceiveAnswer(desc, username)
        }.bind(this), this.handleError);
        */
        this.peer.createAnswer()
            .then(offer => this.answerHandler(offer, username));
    }

    offerHandler(desc, username){
        console.log("creating SDP offer");
        console.log("sdp : "+desc.sdp);
        this.peer.setLocalDescription(desc);
        this.remotePeer.setRemoteDescription(desc);
        socketService().send({id:authService().getUsername(), type: 'offer', sdpDescription:desc.sdp, destUsername: username});
        this.subscribeToAnswer(this.gotAnswer.bind(this));
    }

    answerHandler(desc, username){
        console.log("creating SDP offer");
        this.peer.setLocalDescription(desc);
        this.remotePeer.setRemoteDescription(desc);
        socketService().send({id:authService().getUsername(), type: 'answer', sdpDescription:desc.sdp, destUsername: username});
    }

    //$q
    //$q.all (merge promises)
    subscribeToAnswer(handler){
        /**
        return $q(function(succes, error){
            socketService().subscribe("/topic/"+authService().getUsername()+"/sdpAnswer", success);
        })*/
        return socketService().subscribe("/topic/"+authService().getUsername()+"/sdpAnswer", handler);
    }

    subscribeToOffer(handler){
        return socketService().subscribe("/topic/"+authService().getUsername()+"/sdpOffer", handler);
    }
    handleError(errmsg) {
        console.log("handleError: " + errmsg);
    }
}
export default PeerService.instance;