import {Component, Inject} from '../ngDecorators';
import template from './videoChat.html!text';
import peerService from '/commons/peerService';
import {window, sce} from "commons/externalServices";

@Component({
    selector: 'videochat',
    template: template })
@Inject('$scope')
class VideoChat {
    constructor($scope) {
        this.scope = $scope;
        this.message = 'This is my homepage';
        peerService().getUserMedia().then(this.handleStream.bind(this));
    }

    handleStream(stream){
        this.scope.localStream = sce().trustAsResourceUrl(window().URL.createObjectURL(stream));
        this.scope.$apply();
    }



}

export default VideoChat;