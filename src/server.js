const service = require('./services');
const server = require('../../utils/src/server');
const configuration = require('../../utils/src/configuration');

const port = configuration
    .serversConfiguration
    .prosumer
    .port;

const routes = {
        '/prosumerSignUp': (request, parameters) => service.insertProsumer(parameters),
        '/prosumerLogin': (request, parameters) => service.connectProsumer(parameters),
        '/prosumerLogout': (request, parameters) => service.disconnectProsumer(parameters.token),
        '/getProsumerElectricityConsumption': (request, parameters) => service.getProsumerElectricityConsumption(parameters.token),
        '/getProsumerLogged': (request, parameters) => service.getProsumerLogged(parameters.token),
        '/uploadPicture': (_, [parameters, picturePath]) => service.uploadProsumerPicture(parameters, picturePath),
        '/retrievePicture': (request, parameters, res) => service.retrieveProsumerPicturePath(parameters.token)
            .then(path => server.serveStaticFile(path, res)),
        '/updateData': (request, parameters) => service.updateData(parameters),
        '/accountVerification': (request, parameters, res) => service.accountVerification(parameters.registrationToken)
            .then(path => server.serveStaticFile(path, res))
    }
;

const staticFiles = {
    '/test': __dirname + '/files/file.txt',
    '/': __dirname + '/front/index.html'
};

server.createServer(staticFiles, routes, port, [__dirname + "/front"]);