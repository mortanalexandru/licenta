import {Service} from "/ngDecorators"
import {http, q} from "./externalServices"
import User from "/commons/model/user";


@Service({serviceName: 'authService'})
class AuthService {

    constructor() {
        this.authenticated = false;
        this.currentUser = new User();
        this.loginError = false;
    }

    login(username, password) {
        return q()(function (resolve) {
            http().get('/user',
                {
                    headers: {authorization: "Basic " + btoa(username + ":" + password)}
                }).then(() => {
                this.loginError = false;
                this.authenticated = true;
                this.currentUser.setCredentials(username, password);
                resolve();
            }, () => {
                this.loginError = true;
                console.log("fail");
            })
        }.bind(this));
    };

    isAuthenticated() {
        return this.authenticated;
    };

    getUsername() {
        return this.currentUser.username;
    };
}
export default AuthService.instance;