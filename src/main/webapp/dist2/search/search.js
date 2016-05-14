System.register(['../ngDecorators', './search.html!text', '/commons/securedComponent', '/commons/componentConstants', '/commons/externalServices'], function (_export) {
    'use strict';

    var Component, Inject, template, SecuredComponent, ROOM_STATE, state, Search;
    return {
        setters: [function (_ngDecorators) {
            Component = _ngDecorators.Component;
            Inject = _ngDecorators.Inject;
        }, function (_searchHtmlText) {
            template = _searchHtmlText['default'];
        }, function (_commonsSecuredComponent) {
            SecuredComponent = _commonsSecuredComponent['default'];
        }, function (_commonsComponentConstants) {
            ROOM_STATE = _commonsComponentConstants.ROOM_STATE;
        }, function (_commonsExternalServices) {
            state = _commonsExternalServices.state;
        }],
        execute: function () {
            Search = (function () {

                // $state.go

                function Search($scope) {
                    babelHelpers.classCallCheck(this, _Search);

                    this.scope = $scope;
                    this.message = 'This is my login component';
                    //userService().getUsers().then(function(result){
                    //    this.scope.users = result.data;
                    //    console.log(result);
                    //}.bind(this));
                }

                babelHelpers.createClass(Search, [{
                    key: 'createRoom',
                    value: function createRoom(room) {
                        state().go(ROOM_STATE, { roomName: room.name });
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
//# sourceMappingURL=../../sourcemaps/app/search/search.js.map
