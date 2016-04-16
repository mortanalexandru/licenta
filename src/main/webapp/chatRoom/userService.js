import {Service} from "/ngDecorators"
import {http, q} from "/commons/externalServices"


@Service({serviceName: 'userService'})
class UserService {

    constructor() {

    }

    getRoomUsers(roomName){
        let config = {
            params: {roomName: roomName}
        }
        return http().get('/getRoomUsers', config);
    }

}
export default UserService.instance;