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
        ref: "User"
    },
    scopes: [{
        type: String,
        ref: "Permission",
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
}, {
    timestamps: true,
});

schema.methods.isValid = function () {
    const token = this;

    return !token.revoked;
};

const model = mongoose.model("OAuthAccessToken", schema);

module.exports = model;
