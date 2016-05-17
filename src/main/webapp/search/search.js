import {Component, Inject} from '../ngDecorators';
import template from './search.html!text';
import SecuredComponent from '/commons/securedComponent';
import {ROOM_STATE} from "/commons/componentConstants";
import {state} from "/commons/externalServices";
import authService from '/commons/authService';

@Component({
    selector: 'search',
    template: template })
@Inject('$scope')
class Search{


    // $state.go
    constructor($scope) {
        this.scope = $scope;
        this.scope.authenticated = authService().getUsername() != undefined;
    }

    createRoom(room){
        state().go(ROOM_STATE, {roomName: room.name});
    }



}

export default Search;