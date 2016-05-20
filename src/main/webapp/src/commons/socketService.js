/**
 * Created by Alexandru on 29/02/16.
 */
import {Service} from "../ngDecorators"
import Socket from "sockjs-client";
import Stomp from 'stompjs';
import {q} from "./externalServices"
import authService from './authService';

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
                this.stompClient.heartbeat.outgoing = 2000;
                this.stompClient.heartbeat.incoming = 2000;
                this.stompClient.connect({user: username, room: room}, function(){
                    this.connectingPromise = null;
                    this.connected = true;
                    resolve();
                }.bind(this));
            }.bind(this));
        }
        return this.connectingPromise;
    }

    connectToSearchSocket() {
        if(!this.connectingPromiseSearch){
            this.connectingPromiseSearch = q()(function (resolve, reject) {
                this.socketSearch = new Socket('/searchRooms');
                this.stompClientSearch = Stomp.over(this.socketSearch);
                this.stompClientSearch.heartbeat.outgoing = 2000;
                this.stompClientSearch.heartbeat.incoming = 2000;
                this.stompClientSearch.connect({}, function(){
                    this.connectingPromiseSearch = null;
                    this.connectedSearch = true;
                    resolve();
                }.bind(this));
            }.bind(this));
        }
        return this.connectingPromiseSearch;
    }

    subscribeToSearch(url, handler, id) {
        if (!this.connectedSearch) {
            this.connectToSearchSocket().then(function () {
                this.stompClientSearch.subscribe(url, handler);
            }.bind(this));
        } else {
            return this.stompClientSearch.subscribe(url, handler);
        }
    }



    setConnected(connected){
        this.connected = connected;
    }

    isConnected(){
        return this.connected;
    }

    subscribe(url, handler) {
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

    sendSearch(path, object) {
        if (!this.connectedSearch) {
            this.connectToSearchSocket().then(function () {
                this.stompClientSearch.send(path, {}, JSON.stringify(object));
            }.bind(this));
        } else {
            return this.stompClientSearch.send(path, {}, JSON.stringify(object));
        }

    }


    disconnect(){
        this.socket.close();
        this.stompClient.disconnect();
    }

}
export default SocketService.instance;