const service = require('./services');
const server = require('../../utils/src/server');
const configuration = require('../../utils/src/configuration');

const port = configuration
    .serversConfiguration
    .prosumer
    .port;

const routes = {
        '/signUp': (request, parameters) => service.insertProsumer(parameters.email, parameters.password),
        '/login': (request, parameters) => service.connectProsumer(parameters),
        '/logout': (request, parameters) => service.disconnectProsumer(parameters.token),
        '/getProsumerElectricityConsumption': (request, parameters) => service.getProsumerElectricityConsumption(parameters.token),
        '/getProsumerLogged': (request, parameters) => service.getProsumerLogged(parameters.token),
        '/getCurrentElectricityPrice': (request, parameters) => service.getCurrentElectricityPrice(parameters.token),
        '/getCurrentMarketAvailable': (request, parameters) => service.getCurrentMarketAvailable(parameters.token),
        '/uploadPicture': (_, [parameters, picturePath]) => service.uploadProsumerPicture(parameters, picturePath),
        '/retrievePicture': (request, parameters, res) => service.retrieveProsumerPicturePath(parameters.token)
            .then(path => server.serveStaticFile(path, res)),
        '/updateProductionRatios': (request, parameters) => service.updateProductionRatios(parameters),
        '/updateConsumptionRatios': (request, parameters) => service.updateConsumptionRatios(parameters),
        '/updateBlockedTime': (request, parameters) => service.updateBlockedTime(parameters),
        '/updateMarket': (request, parameters) => service.updateMarket(parameters),
        '/accountVerification': (request, parameters, res) => service.accountVerification(parameters.registrationToken)
            .then(path => server.serveStaticFile(path, res)),
        '/blackout': (request, parameters, res) => {
        }    // TODO
    }
;

const staticFiles = {
    '/test': __dirname + '/files/file.txt',
    '/': __dirname + '/front/index.html'
};

server.createServer(staticFiles, routes, port, [__dirname + "/front", __dirname + "/../../utils/src/front"]);