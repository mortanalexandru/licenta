/**
 * Created by Alexandru on 29/02/16.
 */
import {Service} from "/ngDecorators"
import socketService from '/commons/socketService';
import adapter from "webrtc-adapter";
import {window} from "./externalServices"

@Service({serviceName: 'peerService'})
class PeerService {

    constructor() {
    }

    getUserMedia(){
        return window().navigator.mediaDevices.getUserMedia({video:true, audio:false});
    }

    sendMessage(text) {

    }

}
export default PeerService.instance;