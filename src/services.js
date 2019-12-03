const database = require('../../utils/src/mongo');
const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const server = require('../../utils/src/server');
const configuration = require('../../utils/src/configuration');

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

    var registrationToken = generateToken();
    data.registrationToken = registrationToken;
    
    return database.find(undefined, databaseName, collectionName, {"email":data.email})
        .then((results) => {
            if (results.length <= 1) {
                console.log('This email is already used.');
                return {error : 'This email is already used.'};
            } else {
                const hostname = configuration.serversConfiguration.prosumer.hostname;
                server.sendEmail(
                    'no-reply@greenleanelectric.com',
                    data.email,
                    'Account Verification',//TODO Change url
                    `To activate your account click on the following link : <a href="http://${hostname}//accountVerification?registrationToken=${registrationToken}">Click Here</a>`
                );
    
                return database
                    .insertOne(undefined, databaseName, collectionName, data);
            }
        });

};

exports.accountVerification = function (registrationToken){console.log(registrationToken);
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
    const updateOperation = { $unset: {"registrationToken": ""}};

    return database
        .updateOne(undefined, databaseName, collectionName, {registrationToken}, updateOperation)
        .then((nModified) => {
            if (nModified !== 0) {
                console.log(`User activated'`);
                return __dirname + "\\front\\account-activation-success.html";
            } else {
                console.log(`User not found`);
                return __dirname + "\\front\\account-activation-failure.html";
            }
        });
};

exports.connectProsumer = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
    data.password = hashPassword(data.password);

    return database.find(undefined, databaseName, collectionName, data)
        .then((results) => {
            if (results.length === 1) {
                return results[0];
            }
            return {};
        }).then((results) => {

console.log(results);

            if(!Object.keys(results).length)
                return {error: "Login was unsuccessful, please check your email and password"};
            else if(results.hasOwnProperty("registrationToken"))
                return {error: "Account not activated, check your mailbox."};
            else{
                const token = generateToken();
                const updateOperation = {$set: {token}};

                return database
                    .updateOne(undefined, databaseName, collectionName, data, updateOperation)
                    .then((nModified) => {
                        if (nModified !== 0) {
                            console.log(`User connected with token '${token}'`);
                            return {token};
                        } else {
                            console.log(`User not found`);
                            return {};
                        }
                    });
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