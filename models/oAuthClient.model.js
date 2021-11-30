const mongoose = require("mongoose");
const {Schema} = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    secret: {
        type: String,
        required: true,
        index: true,
    },
    redirect: {
        type: String,
        index: true,
    },
    personalAccessClient: {
        type: Boolean,
        default: false,
    },
    revoked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

schema.index({name: 1, secret: 1}, {unique: true});

schema.statics.isUnique = async function (name, secret) {
    const client = await this.findOne({name, secret});

    if (!client) {
        return true;
    } else if (client.name === name && client.secret === secret) {
        return {name, secret};
    } else if (client.name === name) {
        return {name};
    } else if (client.secret === secret) {
        return {secret};
    }

    return true;
};

const model = mongoose.model("o_auth_client", schema);
module.exports = {OAuthClientModel: model};
