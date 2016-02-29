/**
 * Created by Alexandru on 29/02/16.
 */
import {Service} from "/ngDecorators"
import Socket from "sockjs-client";
import Stomp from 'stompjs';

@Service({serviceName: 'socketService'})
class SocketService {

    constructor() {
        this.socket = new Socket('/chat');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, function (frame) {
            console.log("connected");
        });
    }

    send(object) {
        this.stompClient.send("/app/chat", {}, JSON.stringify(object));
    }


}
export default SocketService.instance;