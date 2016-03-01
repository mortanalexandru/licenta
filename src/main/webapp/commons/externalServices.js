import app from '/appConfig';
import _ from 'underscore';

const ANGULAR_SERVICES = [
    '$http',
    '$rootScope',
    '$state',
    '$window',
    '$sce'
];

const _extServices = {};

app.run(['$injector', ($injector) => {
    ANGULAR_SERVICES.forEach((svcName) => _extServices[svcName] = $injector.get(svcName));
}]);

const http = () => _extServices['$http'];
const rootScope = () => _extServices['$rootScope'];
const state = () => _extServices['$state'];
const window = () => _extServices['$window'];
const sce = () => _extServices['$sce'];

export {_, http, rootScope, state, window, sce}