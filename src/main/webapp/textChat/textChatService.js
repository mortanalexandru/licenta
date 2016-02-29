/**
 * Created by Alexandru on 29/02/16.
 */
import {Service} from "/ngDecorators"
import peerService from '/commons/peerService';

@Service({serviceName: 'textChatService'})
class TextChatService {

    constructor() {
    }

    sendMessage(text) {
        let message = {};
        message.text = text;
        message.date = new Date();
        peerService().send(message);
    }

}
export default TextChatService.instance;