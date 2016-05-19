import {Component, Inject} from '../ngDecorators';
import template from './login.html!text';
import authService from '/commons/authService';
import {state} from "commons/externalServices";
import './login.css!';

@Component({
    selector: 'login',
    template: template })
@Inject('$scope', '$stateParams')
class Login {

    constructor($scope, $stateParams) {
        this.scope = $scope;
        this.stateParams = $stateParams;
    }

    login(user){
        authService().login(user.username, user.password).then(function(){
            let redirectState = 'search';
            let params;
            if(this.stateParams.redirectState){
                redirectState = this.stateParams.redirectState;
            }
            if(this.stateParams.redirectParams){
                params = JSON.parse(this.stateParams.redirectParams);
            }
            state().go(redirectState, params);
        }.bind(this), function(){
            this.scope.error = "Login failed! Please try again!";
        }.bind(this));
    }
}

export default Login;