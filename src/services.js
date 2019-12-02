const database = require('../../utils/src/mongo');
const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const server = require('../../utils/src/server');

const DATABASE_NAME = 'greenleanelectrics';

function hashPassword(pwd) {
    var hash = 0;
    if (pwd.length === 0) return hash;
    for (i = 0; i < pwd.length; i++) {
        char = pwd.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

exports.insertProsumer = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
    data.password = hashPassword(data.password);
    server.sendEmail();
    return database
        .insertOne(undefined, databaseName, collectionName, data);
};

exports.connectProsumer = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
    data.password = hashPassword(data.password);

    const token = generateToken();
    const updateOperation = {$set: {token}};

    return database
        .updateOne(undefined, databaseName, collectionName, data, updateOperation)
        .then((nModified) => {
            if (nModified !== 0) {
                console.log(`User connected with token '${token}'`);
                return JSON.stringify({token});
            } else {
                console.log(`User not found`);
                return {};
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

exports.updateData = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    var token = data.token;
    delete data.token;

    var updateOperation;
    if (data.length > 1)
        updateOperation = {
            $set: {
                data
            }
        };
    else
        updateOperation = {
            $set: data
        };

    return database
        .updateOne(undefined, databaseName, collectionName, {token}, updateOperation)
        .then((nModified) => {
            if (nModified !== 0) {
                return true;
            } else {
                console.log(`User not found or data already with the same values`);
                return {};
            }
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
            if (results.length === 1) {
                delete results[0].password;
                delete results[0]._id;
                return results[0];
            }
            return {};
        });
};

exports.uploadProsumerPicture = function (data, picturePath) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    const prosumer = {
        token: data.token
    };

    const updateOperation = {$set: {picture: picturePath}};

    return database
        .updateOne(undefined, databaseName, collectionName, prosumer, updateOperation)
        .then(() => server.readFile(picturePath));
};

exports.retrieveProsumerPicturePath = function (token) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
    const prosumer = {
        token
    };

    return database
        .find(undefined, databaseName, collectionName, prosumer)
        .then((results) => {
            return results[0].picture;
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
            if (results.length !== 0) {
                const prosumerId = results[0].email;
                const simulatorServer = require('../../utils/src/configuration')
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
            return {};
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