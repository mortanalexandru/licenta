import angular from 'angular';
import app from './appConfig';
import 'uiComponents';
import 'babel-polyfill';

angular.element(document).ready(() => {
    angular.bootstrap(document.body, [app.name], {
        strictDi: true
    });
});