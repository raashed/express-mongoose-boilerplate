const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {Schema, ObjectId} = mongoose;

const status = Object.freeze({ active: 'active', inactive: 'inactive', deleted: 'deleted' });
const gender = Object.freeze({ male: 'male', female: 'female' });
const identityType = Object.freeze({ nid: 'nid', passport: 'passport', birthCertificate: 'birth_certificate' });

const roleSchema = new Schema({
    _id: { type: ObjectId, required: false, ref: 'role', default: null },
    name: { type: String, required: false, default: null }
},{ _id : false });

const departmentSchema = new Schema({
    _id: { type: ObjectId, required: false, ref: 'department', default: null },
    name: { type: String, required: false, default: null }
},{ _id : false });

const identitySchema = new Schema([{
    type: { type: String, enum: Object.values(identityType), required: false, default: null },
    identity: { type: String, required: false, default: null },
},{ _id : false }]);

const personalSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: [{ type: String, required: true }],
    gender: { type: String, enum: Object.values(gender), required: true },
    photo: { type: String, required: false, default: null },
    dateOfBirth: { type: Date, required: false, default: null },
    bloodGroup: { type: String, required: false, default: null },
    fathersName: { type: String, required: false, default: null },
    mothersName: { type: String, required: false, default: null },
    identity: { type: identitySchema, required: false },
    religion: { type: String, required: false, default: null },
    presentAddress: { type: String, required: false, default: null },
    permanentAddress: { type: String, required: false, default: null },
},{ _id : false });

const schema = new Schema({
    role: {
        type: roleSchema,
        required: false,
        default: () => ({})
    },
    department: {
        type: departmentSchema,
        required: false,
        default: () => ({})
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
    personal: {
        type: personalSchema,
        required: false,
        default: () => ({})
    },
    superAdmin: {
        type: Boolean,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(status),
        default: status.active
    },
}, { timestamps: true });

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

const model = mongoose.model("user", schema);
module.exports = {UserModel: model, UserStatus: status, UserGender: gender, UserIdentityType: identityType};
