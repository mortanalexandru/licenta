import {Component, Inject} from '../ngDecorators';
import template from './login.html!text';
import authService from '/commons/authService';

@Component({
    selector: 'login',
    template: template })
@Inject('$scope')
class Login {
    constructor($scope) {
        this.scope = $scope;
        this.message = 'This is my login component';
    }
    login(user){
        console.log(user.username);
        console.log(user.password);
        authService().login(user.username, user.password);
    }
}

export default Login;