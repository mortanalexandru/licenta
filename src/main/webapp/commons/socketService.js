/**
 * Created by Alexandru on 29/02/16.
 */
import {Service} from "/ngDecorators"
import Socket from "sockjs-client";
import Stomp from 'stompjs';
import {q} from "./externalServices"
import authService from '/commons/authService';

@Service({serviceName: 'socketService'})
class SocketService {

    connected = false;



    connect(username) {
        this.username = username;

        if(!this.connectingPromise){
            this.connectingPromise = q()(function (resolve, reject) {
                console.log("inside promise");
                this.socket = new Socket('/chat');
                this.stompClient = Stomp.over(this.socket);
                this.stompClient.connect({user: username}, function(){
                    console.log("done connecting");
                    this.connectingPromise = null;
                    this.connected = true;
                    resolve();
                }.bind(this));
            }.bind(this));
        }
        return this.connectingPromise;

    }



    setConnected(connected){
        this.connected = connected;
    }

    isConnected(){
        return this.connected;
    }

    subscribe(url, handler, id) {
        if (!this.connected) {
            this.connect(authService().getUsername()).then(function () {
                console.log("inside subscribe then");
                this.username = authService().getUsername();
                this.stompClient.subscribe(url, handler);
            }.bind(this));
        } else {
           return this.stompClient.subscribe(url, handler);
        }
    }

    send(path, object) {
        if (!this.connected) {
            this.connect(authService().getUsername()).then(function () {
                this.stompClient.send(path, {}, JSON.stringify(object));
            }.bind(this));
        } else {
            return this.stompClient.send(path, {}, JSON.stringify(object));
        }

    }


}
export default SocketService.instance;