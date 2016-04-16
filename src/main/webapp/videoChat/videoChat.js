import {Component, Inject, Secured} from '../ngDecorators';
import template from './videoChat.html!text';
import peerService from '/commons/peerService';
import {window, sce} from "commons/externalServices";
import socketService from '/commons/socketService';
import authService from '/commons/authService';
import SecuredComponent from '/commons/securedComponent';

@Component({
    selector: 'videochat',
    template: template
})
@Inject('$scope', '$stateParams')
class VideoChat extends SecuredComponent{

    constructor($scope, $stateParams) {
        super();
        this.scope = $scope;
        this.stateParams = $stateParams;
        this.message = 'This is my homepage';
        peerService().getUserMedia().then(this.handleStream.bind(this));
        peerService().connect(this.handleRemoteStream.bind(this));
    }

    handleStream(stream) {
        this.localStreamObject = stream;
        peerService().setLocalStream(stream);
        this.scope.localStream = sce().trustAsResourceUrl(window().URL.createObjectURL(stream));
        this.scope.$apply();
    }

    handleRemoteStream(e) {
        this.scope.remoteStream = sce().trustAsResourceUrl(window().URL.createObjectURL(e.stream));
        this.scope.$apply();
    }

    call() {
        peerService().call(this.stateParams.destUsername);
    }

}

export default VideoChat;