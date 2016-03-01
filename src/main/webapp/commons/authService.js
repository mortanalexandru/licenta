import {Service} from "/ngDecorators"
import {http} from "./externalServices"
import User from "/commons/model/user";


@Service({serviceName: 'authService'})
class AuthService {

    constructor() {
        this.authenticated = false;
        this.currentUser = new User();
        this.loginError = false;
    }

    login(username, password) {
        http().get('/user',
            {
                'username': username,
                'password': password
            }).then(() => {
            this.loginError = false;
            this.authenticated = true;
            this.currentUser.setCredentials(username, password);
        }, () => {
            this.loginError = true;
            console.log("fail");
        })
    }

    getUsername(){
        return this.currentUser.username;
    }
}
export default AuthService.instance;