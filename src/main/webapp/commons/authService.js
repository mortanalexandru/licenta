import {Service} from "/ngDecorators"
import {http} from "./externalServices"


@Service({serviceName: 'authService'})
class AuthService {

    constructor() {
        this.authenticated = false;
        // this.currentUser = new User();
        this.loginError = false;
    }

    login(username, password) {
        http().post('/user/login',
            {
                'username': username,
                'password': password
            }).then(() => {
            this.loginError = false;
            console.log("success");
            this.authenticated = true;
        }, () => {
            this.loginError = true;
            console.log("fail");
        })
    }



}
export default AuthService.instance;