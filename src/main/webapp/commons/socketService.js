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



    connect(username, room) {
        this.username = username;
        this.room = room;
        if(!this.connectingPromise){
            this.connectingPromise = q()(function (resolve, reject) {
                this.socket = new Socket('/chat');
                this.stompClient = Stomp.over(this.socket);
                this.stompClient.connect({user: username, room: room}, function(){
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
            this.connect(this.username, this.room).then(function () {
                this.username = authService().getUsername();
                this.stompClient.subscribe(url, handler);
            }.bind(this));
        } else {
           return this.stompClient.subscribe(url, handler);
        }
    }

    send(path, object) {
        if (!this.connected) {
            this.connect(this.username, this.room).then(function () {
                this.stompClient.send(path, {}, JSON.stringify(object));
            }.bind(this));
        } else {
            return this.stompClient.send(path, {}, JSON.stringify(object));
        }

    }





}
export default SocketService.instance;