import {Component, Inject} from '../ngDecorators';
import template from './loginButton.html!text';
import authService from '/commons/authService';
import {state, location} from "commons/externalServices";
import './loginButton.css!';

@Component({
    selector: 'loginbutton',
    template: template })
@Inject('$scope', '$stateParams')
class LoginButton {

    constructor($scope, $stateParams) {
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.scope.state = state();
        this.scope.username = authService().getUsername();
        this.scope.authenticated = this.scope.username != undefined;
    }

    logout(){
        authService().logout();
        let redirectState = 'search';
        this.scope.authenticated = false;
        state().reload();
    }
}

export default LoginButton;