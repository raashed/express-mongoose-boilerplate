const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;
const moment = require("moment");

const schema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
        ref: "o_auth_access_token",
    },
    client: {
        type: ObjectId,
        required: true,
        ref: "o_auth_client"
    },
    revoked: {
        type: Boolean,
        default: false,
    },
    expires: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

schema.methods.isValid = function () {
    const token = this;
    return !token.revoked && moment(token.expires) > moment(new Date());
};

const model = mongoose.model("o_auth_refresh_token", schema);
module.exports = {OAuthRefreshTokenModel: model};
