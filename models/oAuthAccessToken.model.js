const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;

const schema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    user: {
        type: ObjectId,
        required: true,
        ref: "user"
    },
    scopes: [{
        type: String,
        ref: "permission",
        default: []
    }],
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
    return !token.revoked;
};

const model = mongoose.model("o_auth_access_token", schema);
module.exports = {OAuthAccessTokenModel: model};
