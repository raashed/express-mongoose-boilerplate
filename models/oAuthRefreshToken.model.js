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
        ref: "OAuthAccessToken",
    },
    client: {
        type: ObjectId,
        required: true,
        ref: "OAuthClient"
    },
    revoked: {
        type: Boolean,
        default: false,
    },
    expires: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});

schema.methods.isValid = function () {
    const token = this;

    return !token.revoked && moment(token.expires) > moment(new Date());
};

const model = mongoose.model("OAuthRefreshToken", schema);

module.exports = model;
