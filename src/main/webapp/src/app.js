import angular from 'angular';
import 'babel-polyfill';
import app from './appConfig';
import './uiComponents';


angular.element(document).ready(() => {
    angular.bootstrap(document.body, [app.name], {
        strictDi: true
    });
});