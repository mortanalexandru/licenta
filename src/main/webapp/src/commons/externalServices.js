import app from '../appConfig';
import _ from 'underscore';

const ANGULAR_SERVICES = [
    '$http',
    '$rootScope',
    '$state',
    '$window',
    '$sce',
    '$q',
    '$location'
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
const q = () => _extServices['$q'];
const location = () => _extServices['$location'];

export {_, http, rootScope, state, window, sce, q, location}