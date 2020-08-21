const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;
const bcrypt = require("bcrypt");

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/]
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{
        type: ObjectId,
        ref: "Role",
        default: [],
    }],
    activated: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

schema.statics.isUnique = async function (username, email) {
    const user = await this.findOne({
        $or: [{email}, {username}]
    });

    if (!user) {
        return true;
    } else if (user.username === username && user.email === email) {
        return {username, email};
    } else if (user.email === email) {
        return {email};
    } else if (user.username === username) {
        return {username};
    }

    return true;
};

schema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

schema.methods.isPasswordMatch = async function (password) {
    const user = this;

    return bcrypt.compare(password, user.password);
};

schema.methods.toJSON = function () {
    let obj = this.toObject();

    delete obj.activated;
    delete obj.password;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
};

const model = mongoose.model("User", schema);

module.exports = model;
