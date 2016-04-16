import {Component, Inject, Secured} from '../ngDecorators';
import template from './textChat.html!text';
import textChatService from './textChatService';
import SecuredComponent from '/commons/securedComponent';

@Component({
    selector: 'textchat',
    template: template })
@Inject('$scope')
class TextChat extends SecuredComponent{
    constructor($scope) {
        super();
        this.scope = $scope;
        this.scope.messages = [];
        this.scope.message = "";
    }

    send(message){
        textChatService().send(message);
    }
}

export default TextChat;