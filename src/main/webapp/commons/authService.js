import {Service} from "/ngDecorators"
import {http, q} from "./externalServices"
import User from "/commons/model/user";
import storageService from '/commons/storageService';

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
                storageService().save("username", username);
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
        if(!this.currentUser.username) {
            this.currentUser.username = storageService().get("username");
        }
        return this.currentUser.username;
    };
}
export default AuthService.instance;