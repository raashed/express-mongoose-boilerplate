const mongoose = require("mongoose");
const {Schema} = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: [{
        type: String,
        ref: "Permission",
        default: [],
    }],
}, {
    timestamps: true,
});

schema.statics.isUnique = async function (name) {
    const role = await this.findOne({name: name});
    if (!role) {
        return false;
    }

    if (role.name === name) {
        return {name};
    }

    return false;
};

schema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const model = mongoose.model("Role", schema);

module.exports = model;
