const database = require('../../utils/src/mongo');
const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const server = require('../../utils/src/server');
const configuration = require('../../utils/src/configuration');

const DATABASE_NAME = 'greenleanelectrics';


exports.insertProsumer = function (email, password) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    let prosumer = {
        email,
        password,
        bufferSize: 3000,
        bufferFilling: 0,
        productionRatioBuffer : 0.7,
        productionRatioMarket : 0.3,
        consumptionRatioBuffer : 0,
        consumptionRatioMarket : 1,
        registrationToken: generateToken()
    };

    return database.find(databaseName, collectionName, {'email': email})
        .then((results) => {
            if (results.length >= 1) {
                console.log('This email is already used.');
                return {error: 'This email is already used.'};
            } else {
                const url = `${configuration.serversConfiguration.prosumer.hostname}:${configuration.serversConfiguration.prosumer.port}`;
                server.sendEmail(
                    'no-reply@greenleanelectric.com',
                    email,
                    'Account Verification',
                    `To activate your account click on the following link : <a href="http://${url}/accountVerification?registrationToken=${prosumer.registrationToken}">Click Here</a>`
                );

                return database
                    .insertOne(databaseName, collectionName, prosumer);
            }
        });

};

exports.accountVerification = function (registrationToken) {
    console.log(registrationToken);
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
    const updateOperation = {$unset: {"registrationToken": ""}};

    return database
        .updateOne(databaseName, collectionName, {registrationToken}, updateOperation)
        .then((nModified) => {
            if (nModified !== 0) {
                console.log(`User activated'`);
                return __dirname + "/front/account-activation-success.html";
            } else {
                console.log(`User not found`);
                return __dirname + "/front/account-activation-failure.html";
            }
        });
};

exports.connectProsumer = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    return database.find(databaseName, collectionName, data)
        .then((results) => {
            if (results.length === 1) {
                return results[0];
            }
            return {};
        }).then((results) => {

            console.log(results);

            if (!Object.keys(results).length)
                return {error: "Login was unsuccessful, please check your email and password"};
            else if (results.hasOwnProperty("registrationToken"))
                return {error: "Account not activated, check your mailbox."};
            else {
                const token = generateToken();
                const updateOperation = {$set: {token}};

                return database
                    .updateOne(databaseName, collectionName, data, updateOperation)
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
        .updateOne(databaseName, collectionName, prosumer, updateOperation)
        .then(() => {
            console.log(`User connected with token '${token}' has been disconnected`);
            return token;
        });
};

exports.updateProductionRatios = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    const token = data.token;

    var updateOperation = {
            $set: {
                productionRatioBuffer: data.productionRatioBuffer,
                productionRatioMarket: data.productionRatioMarket
            }
        };

    return database
        .updateOne(databaseName, collectionName, {token}, updateOperation)
        .then((nModified) => {
            if (nModified !== 0) {
                return true;
            } else {
                console.log(`User not found or data already with the same values`);
                return {};
            }
        });
};

exports.updateConsumptionRatios = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    const token = data.token;

    var updateOperation = {
            $set: {
                consumptionRatioBuffer: data.consumptionRatioBuffer,
                consumptionRatioMarket: data.consumptionRatioMarket
            }
        };

    return database
        .updateOne(databaseName, collectionName, {token}, updateOperation)
        .then((nModified) => {
            if (nModified !== 0) {
                return true;
            } else {
                console.log(`User not found or data already with the same values`);
                return {};
            }
        });
};

exports.updateBlockedTime = function (data) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    const token = data.token;

    var updateOperation = {
            $set: {
                blockedTime: data.blockedTime,
                initBlockedTime: data.initBlockedTime
            }
        };

    return database
        .updateOne(databaseName, collectionName, {token}, updateOperation)
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
        .find(databaseName, collectionName, prosumer)
        .then((results) => {
            if (results.length === 1) {
                delete results[0].password;
                delete results[0]._id;
                return results[0];
            }
            return {};
        });
};

exports.getCurrentElectricityPrice = function (token) {
    const databaseName = DATABASE_NAME;
    var collectionName = 'prosumers';
    const prosumer = {
        token
    };

    return database
        .find(databaseName, collectionName, prosumer)
        .then((results) => {
            if (results.length === 1) {
                return results[0];
            }
            else {
                throw 'No prosumer known';
            }
        }).then((results) => {
            return database.findLast(DATABASE_NAME, 'market', {}, 'date');
        });
};

exports.uploadProsumerPicture = function (data, picturePath) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';

    const prosumer = {
        token: data.token
    };

    const extension = server.findExtension(picturePath);
    const newPath = configuration.uploadDirectory + new Date().getTime() + (
        extension
            ? '.' + extension
            : ''
    );

    return server.moveFile(picturePath, newPath)
        .then(() => database
            .updateOne(databaseName, collectionName, prosumer, {$set: {picture: newPath}})
            .then(() => server.readFile(newPath)));
};

exports.retrieveProsumerPicturePath = function (token) {
    const databaseName = DATABASE_NAME;
    const collectionName = 'prosumers';
    const prosumer = {
        token
    };

    return database
        .find(databaseName, collectionName, prosumer)
        .then((results) => {
            return results[0].picture;
        })
        .catch(() => {
            return undefined;
        });
};

function generateToken() {
    const crypto = require("crypto");
    return crypto.randomBytes(16).toString("hex");
}

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