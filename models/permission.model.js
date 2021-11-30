const mongoose = require("mongoose");
const {Schema} = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    group: {
        type: String,
        required: true,
    },
}, { timestamps: true });

schema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const model = mongoose.model("permission", schema);
module.exports = {PermissionModel: model};
