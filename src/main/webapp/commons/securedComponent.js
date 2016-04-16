import authService from '/commons/authService';
import socketService from '/commons/socketService';
import {state} from "/commons/externalServices";
import {LOGIN_STATE} from "/commons/componentConstants";

class SecuredComponent {

    constructor() {
        if (!authService().isAuthenticated()){
            state().go(LOGIN_STATE);
        } else {
            if(!socketService().isConnected()){
                socketService().connect(authService().getUsername()).then(function(){
                    socketService().setConnected(true);
                });
            }


        }
    }

}

export default SecuredComponent;