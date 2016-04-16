/**
 * Created by Alexandru on 29/02/16.
 */
import {Service} from "/ngDecorators"
import Socket from "sockjs-client";
import Stomp from 'stompjs';
import {q} from "./externalServices"

@Service({serviceName: 'socketService'})
class SocketService {

    connected = false;


    connect(username) {
        this.username = username;
        this.socket = new Socket('/chat');
        this.stompClient = Stomp.over(this.socket);
        return q()(function (resolve, reject) {
            this.stompClient.connect({user: username}, resolve);
        }.bind(this));

    }

    setConnected(connected){
        this.connected = connected;
    }

    isConnected(){
        return this.connected;
    }

    subscribe(url, handler, id) {
        if (!this.connected) {
            this.connect(this.username).then(function () {
                this.connected = true;
                this.stompClient.subscribe(url, handler, {id: this.username});
            }.bind(this));
        } else {
           return this.stompClient.subscribe(url, handler, {id: this.username});
        }
    }

    send(path, object) {
        if (!this.connected) {
            this.connect("alex");
        } else {
            return this.stompClient.send(path, {}, JSON.stringify(object));
        }

    }


}
export default SocketService.instance;