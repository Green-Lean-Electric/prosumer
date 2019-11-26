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
    '/isProsumerLogged': request => service.isProsumerLogged(
        server.getParam(request, 'token')
    ),
};

const staticFiles = {
    '/test': __dirname + '/files/file.txt',
    '/': __dirname + '/front/index.html'
};

server.createServer(staticFiles, routes, port, [__dirname + "/front"]);