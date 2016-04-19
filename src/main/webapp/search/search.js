import {Component, Inject} from '../ngDecorators';
import template from './search.html!text';
import SecuredComponent from '/commons/securedComponent';
import {ROOM_STATE} from "/commons/componentConstants";
import {state} from "/commons/externalServices";

@Component({
    selector: 'search',
    template: template })
@Inject('$scope')
class Search{


    // $state.go
    constructor($scope) {
        this.scope = $scope;
        this.message = 'This is my login component';
        //userService().getUsers().then(function(result){
        //    this.scope.users = result.data;
        //    console.log(result);
        //}.bind(this));
    }

    createRoom(room){
        state().go(ROOM_STATE, {roomName: room.name});
    }



}

export default Search;