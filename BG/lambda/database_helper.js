"use strict";
var LOADOUT_TABLE_NAME = "loadoutData";
var localUrl = "http://localhost:8001";
var localCredentials = {
    region: "us-east-1",
    accessKeyId: "fake",
    secretAccessKey: "fake"
};
var localDynasty = require("dynasty")(localCredentials, localUrl);
var dynasty = localDynasty;
//comment line 10 and uncomment line 12 for production
//var dynasty = require("dynasty")({});

function DatabaseHelper() {
}

var loadoutTable = function () {
    return dynasty.table(LOADOUT_TABLE_NAME);
};

DatabaseHelper.prototype.createLoadoutTable = function () {
    return dynasty.describe(LOADOUT_TABLE_NAME)
        .catch(function (error) {
            console.log("createLoadoutTable::error: ", error);
            return dynasty.create(LOADOUT_TABLE_NAME, {
                key_schema: {
                    hash: ["userId", "string"]
                }
            });
        });
};

DatabaseHelper.prototype.storeLoadoutData = function (userId, loadoutData) {
    console.log("writing loadoutData to database for user " + userId);
    return loadoutTable().insert({
        userId: userId,
        data: JSON.stringify(loadoutData)
    }).catch(function (error) {
        console.log(error);
    });
};

DatabaseHelper.prototype.readLoadoutData = function (userId) {
    console.log("reading loadout with user id of : " + userId);
    return loadoutTable().find(userId)
        .then(function (result) {
            var data = (result === undefined ? {} : JSON.parse(result["data"]));
            return data;
        }).catch(function (error) {
            console.log(error);
        });
};

module.exports = DatabaseHelper;



