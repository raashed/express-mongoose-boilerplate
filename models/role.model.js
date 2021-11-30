const mongoose = require("mongoose");
const {Schema} = mongoose;

const status = Object.freeze({
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
});

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(status),
        required: true,
    },
    permissions: [{
        type: String,
        default: [],
    }],
}, { timestamps: true });

schema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const model = mongoose.model("role", schema);
module.exports = {RoleModel: model, RoleStatus: status};
