const database = require('../../utils/src/mongo.js');
const http = require('http');
const querystring = require('querystring');

const DATABASE_NAME = 'greenleanelectrics';

exports.insertProsumer = function (email, password) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
    const prosumer = {email, password};

    return database
        .insertOne(undefined, databaseName, collectionName, prosumer);
};

exports.connectProsumer = function (email, password) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    const prosumer = {
        email,
        password
    };
    const token = generateToken();
    const updateOperation = {$set: {token}};

    return database
        .updateOne(undefined, databaseName, collectionName, prosumer, updateOperation)
        .then(() => {
            console.log(`User connected with token '${token}'`);
            return token;
        });
};

exports.disconnectProsumer = function (token) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
    const prosumer = {
        token
    };
    const updateOperation = {$set: {token: null}};

    return database
        .updateOne(undefined, databaseName, collectionName, prosumer, updateOperation)
        .then(() => {
            console.log(`User connected with token '${token}' has been disconnected`);
            return token;
        });
};

function generateToken() {
    const crypto = require("crypto");
    return crypto.randomBytes(16).toString("hex");
}

exports.getProsumerElectricityConsumption = function (token) {
    const databaseName = 'greenleanelectrics';
    const collectionName = 'prosumers';

    const prosumertoken = {
        token
    };

    return database
        .find(undefined, databaseName, collectionName, prosumertoken)
        .then((results) => {
            const prosumerId = results[0].email;
            const simulatorServer = require('../../utils/src/configuration.js')
                .serversConfiguration
                .simulator;

            const options = {
                hostname: simulatorServer.hostname,
                port: simulatorServer.port,
                path: '/getElectricityConsumption?' + querystring.stringify({prosumerId}),
                method: 'GET'
            };

            return httpRequest(options);
        });
};

function httpRequest(options, postData) {
    return new Promise(function (resolve, reject) {
        const request = http.request(options, function (reply) {
            if (reply.statusCode < 200 || reply.statusCode >= 300) {
                return reject(new Error('status=' + reply.statusCode));
            }
            let body = [];
            reply.on('data', function (chunk) {
                body.push(chunk);
            });
            reply.on('end', function () {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
        request.on('error', function (error) {
            reject(error);
        });
        if (postData) {
            request.write(postData);
        }
        request.end();
    });
}