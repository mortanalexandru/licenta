import {Component, Inject} from '../ngDecorators';
import template from './search.html!text';
import SecuredComponent from '/commons/securedComponent';
import {ROOM_STATE} from "/commons/componentConstants";
import {state} from "/commons/externalServices";
import authService from '/commons/authService';
import socketService from '/commons/socketService';

@Component({
    selector: 'search',
    template: template })
@Inject('$scope')
class Search{

    constructor($scope) {
        this.scope = $scope;
        this.scope.authenticated = authService().getUsername() != undefined;
        this.scope.rooms = {};
        this.initSocket();
    }


    initSocket(){
        socketService().connectToSearchSocket().then(this.getRooms.bind(this));
    }

    getRooms(){
        socketService().subscribeToSearch("/message/rooms", this.roomUpdateHandler.bind(this));
        this.sendGetRoomsRequest();
    }

    sendGetRoomsRequest(){
        socketService().sendSearch("/app/searchRooms/getRooms",{});
    }

    roomUpdateHandler(data){
        this.scope.rooms = JSON.parse(data.body);
        this.scope.$apply();
    }

    createRoom(room){
        if(this.isRoomCreated(room.name)){
            this.scope.error = "Room already created";
        }else{
            state().go(ROOM_STATE, {roomName: room.name});
            this.scope.error = "";
        }
    }

    isRoomCreated(roomName){
        for(let i=0; i < this.scope.rooms.length; i++){
            if(this.scope.rooms[i].roomName == roomName){
                return true;
            }
        }
        return false;
    }



}

export default Search;