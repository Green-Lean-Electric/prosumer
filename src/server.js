const service = require('./services.js');
const server = require('../../utils/src/server.js');

const port = require('../../utils/src/configuration.js')
    .serversConfiguration
    .prosumer
    .port;

const routes = {
    '/prosumerSignUp': request => service.insertProsumer(
        server.getParam(request, 'email'),
        server.getParam(request, 'password')
    ),
    '/prosumerLogin': request => service.connectProsumer(
        server.getParam(request, 'email'),
        server.getParam(request, 'pwd')
    ),
    '/prosumerLogout': request => service.disconnectProsumer(
        server.getParam(request, 'token')
    ),
    '/getProsumerElectricityConsumption': request => service.getProsumerElectricityConsumption(
        server.getParam(request, 'token')
    ),
};

const staticFiles = {
    '/test': '/files/file.txt',
    '/' : '/front/index.html',
    '/' : '/front/js/sb-admin-2.min.js',
    '/' : '/front/css/sb-admin-2.min.css',
    '/' : '/front/vendor/jquery/jquery.min.js',
    '/' : '/front/vendor/bootstrap/js/bootstrap.bundle.min.js',
    '/' : '/front/vendor/jquery-easing/jquery.easing.min.js',
};

server.createServer(__dirname, staticFiles, routes, port);