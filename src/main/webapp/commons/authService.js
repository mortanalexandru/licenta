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
        return q()(function (resolve, fail) {
            let headers =  {authorization: "Basic " + btoa(username + ":" + password)};

            http().get('/user', {headers : headers}).success(function(data) {
                this.authenticated = true;
                this.currentUser.setCredentials(username, password);
                storageService().save("username", username);
                resolve();
            }.bind(this)).error(function() {
                fail();
            });

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

    logout() {
        this.authenticated = false;
        this.currentUser = new User();
        storageService().remove("username");
    }
}
export default AuthService.instance;