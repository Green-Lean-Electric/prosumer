const service = require('./services.js');
const server = require('../../utils/src/server.js');

const port = require('../../utils/src/configuration.js')
    .serversConfiguration
    .prosumer
    .port;

const routes = {
    '/prosumerSignUp': request => parseParams(request).then( data => service.insertProsumer(data)),
    '/prosumerLogin': request => parseParams(request).then( data => service.connectProsumer(data)),
    '/prosumerLogout': request => service.disconnectProsumer(
        server.getParam(request, 'token')
    ),
    '/getProsumerElectricityConsumption': request => service.getProsumerElectricityConsumption(
        server.getParam(request, 'token')
    ),
    '/getProsumerLogged': request => service.getProsumerLogged(
        server.getParam(request, 'token')
    ),
    '/uploadPicture': request => parseParams(request).then( data => service.uploadProsumerPicture(data)),
    '/changeRatio': request => parseParams(request).then( data => service.changeRatio(data)),
};

const staticFiles = {
    '/test': __dirname + '/files/file.txt',
    '/': __dirname + '/front/index.html'
};

server.createServer(staticFiles, routes, port, [__dirname + "/front"]);

function parseParams(req){
    let data  = [];
    req.on('data', chunk => {
        data.push(chunk);
    });
    return new Promise((resolve, reject) => {
        req.on('end', () => {
            resolve(data);
        });
    });
}