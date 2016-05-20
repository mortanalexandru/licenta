System.register(['../ngDecorators', './search.html!text', '../commons/componentConstants', '../commons/externalServices', '../commons/authService', '../commons/socketService', './search.css!'], function (_export) {
    'use strict';

    var Component, Inject, template, ROOM_STATE, state, authService, socketService, Search;
    return {
        setters: [function (_ngDecorators) {
            Component = _ngDecorators.Component;
            Inject = _ngDecorators.Inject;
        }, function (_searchHtmlText) {
            template = _searchHtmlText['default'];
        }, function (_commonsComponentConstants) {
            ROOM_STATE = _commonsComponentConstants.ROOM_STATE;
        }, function (_commonsExternalServices) {
            state = _commonsExternalServices.state;
        }, function (_commonsAuthService) {
            authService = _commonsAuthService['default'];
        }, function (_commonsSocketService) {
            socketService = _commonsSocketService['default'];
        }, function (_searchCss) {}],
        execute: function () {
            Search = (function () {
                function Search($scope) {
                    babelHelpers.classCallCheck(this, _Search);

                    this.scope = $scope;
                    this.scope.authenticated = authService().getUsername() != undefined;
                    this.scope.rooms = {};
                    this.initSocket();
                }

                babelHelpers.createClass(Search, [{
                    key: 'initSocket',
                    value: function initSocket() {
                        socketService().connectToSearchSocket().then(this.getRooms.bind(this));
                    }
                }, {
                    key: 'getRooms',
                    value: function getRooms() {
                        socketService().subscribeToSearch("/message/rooms", this.roomUpdateHandler.bind(this));
                        this.sendGetRoomsRequest();
                    }
                }, {
                    key: 'sendGetRoomsRequest',
                    value: function sendGetRoomsRequest() {
                        socketService().sendSearch("/app/searchRooms/getRooms", {});
                    }
                }, {
                    key: 'roomUpdateHandler',
                    value: function roomUpdateHandler(data) {
                        this.scope.rooms = JSON.parse(data.body);
                        this.scope.$apply();
                    }
                }, {
                    key: 'createRoom',
                    value: function createRoom(room) {
                        if (this.isRoomCreated(room.name)) {
                            this.scope.error = "Room already created";
                        } else {
                            state().go(ROOM_STATE, { roomName: room.name });
                            this.scope.error = "";
                        }
                    }
                }, {
                    key: 'isRoomCreated',
                    value: function isRoomCreated(roomName) {
                        for (var i = 0; i < this.scope.rooms.length; i++) {
                            if (this.scope.rooms[i].roomName == roomName) {
                                return true;
                            }
                        }
                        return false;
                    }
                }]);
                var _Search = Search;
                Search = Inject('$scope')(Search) || Search;
                Search = Component({
                    selector: 'search',
                    template: template })(Search) || Search;
                return Search;
            })();

            _export('default', Search);
        }
    };
});
//# sourceMappingURL=../sourcemaps/search/search.js.map
