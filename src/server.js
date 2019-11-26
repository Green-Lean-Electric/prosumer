const service = require('./services.js');
const server = require('../../utils/src/server.js');
const fs = require('fs');
const path = require('path');

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

const staticFilesDirectory = __dirname + "/front";

addStaticFilesFromDirectory(staticFilesDirectory);

function addStaticFilesFromDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        files.forEach(file => {

            const fullPath = path.join(directory, file);

            fs.stat(fullPath, (_, stat) => {
                if (stat.isFile()) {
                    staticFiles[path.join('/', path.relative(staticFilesDirectory, fullPath)).replace(/\\/g, "/")] = fullPath;
                } else if (stat.isDirectory()) {
                    addStaticFilesFromDirectory(fullPath);
                }
            });
        });
    });
}

server.createServer(staticFiles, routes, port);