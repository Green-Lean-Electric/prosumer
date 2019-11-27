const database = require('../../utils/src/mongo.js');
const http = require('http');
const querystring = require('querystring');

const DATABASE_NAME = 'greenleanelectrics';

exports.insertProsumer = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    return database
        .insertOne(undefined, databaseName, collectionName, JSON.parse(data));
};

exports.connectProsumer = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    const token = generateToken();
    const updateOperation = {$set: {token}};

    return database
        .updateOne(undefined, databaseName, collectionName, JSON.parse(data), updateOperation)
        .then((nModified) => {
            if(nModified != 0){
                console.log(`User connected with token '${token}'`);
                return JSON.stringify({ token });
            }else{
                console.log(`User not found`);
                return false;
            }
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

exports.getProsumerLogged = function (token) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
    const prosumer = {
        token
    };

    return database
        .find(undefined, databaseName, collectionName, prosumer)
        .then((results) => {
            if(results.length == 1){
                var response = {
                    "email" : results[0].email,
                    "picture" : results[0].picture
                };
                return response;
            }
            return false;
        });
};

exports.uploadProsumerPicture = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
//console.log(data);

//TODO: Data on sait pas trop ce que c'est et on sait pas comment le convertir ni comment save l'image sur le serv
    const prosumer = {
        token : "d99755780ffbd544e25b91f398d0393b" //TODO a passer dans la requete
    };

    const updateOperation = {$set: {picture: data}};

    return database
        .updateOne(undefined, databaseName, collectionName, prosumer, updateOperation)
        .then(() => {
            return true;
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
            if(results.length != 0){
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
            }
            return false;
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