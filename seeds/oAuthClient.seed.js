const {OAuthClientModel} = require("../models/oAuthClient.model");
const validationError = require("../utils/validationError");

setTimeout(async () => {
    const {name, secret, redirect, personalAccessClient, revoked} = {
        name: "demo-client",
        secret: "demo-secret",
        redirect: "http://localhost:5566/",
        personalAccessClient: true,
        revoked: false
    };
    const client = new OAuthClientModel({name, secret, redirect, personalAccessClient, revoked,});

    const validation = await  validationError.uniqueCheck(await OAuthClientModel.isUnique(name, secret));

    if (Object.keys(validation).length === 0) {
        const newClient = await client.save();
        console.log(newClient);
    } else {
        console.log(validation)
    }

}, 1000);
