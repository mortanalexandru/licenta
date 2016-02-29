import {Component, Inject} from '../ngDecorators';
import template from './textChat.html!text';
import textChatService from './textChatService';

@Component({
    selector: 'textchat',
    template: template })
@Inject('$scope')
class TextChat {
    constructor($scope) {
        this.scope = $scope;
        this.scope.messages = [];
        this.scope.message = "";
    }

    send(message){
        textChatService().send(message);
    }
}

export default TextChat;