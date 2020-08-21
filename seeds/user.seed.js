const UserModel = require("../models/user.model");
const validationError = require("../utils/validationError");

setTimeout(async () => {
    const {name, email, username, password, roles, activated} = {
        name: "Md. Rashedul Islam",
        email: "rashed.rsd4@gmail.com",
        username: "raashed",
        password: "P@$$w0rd",
        roles: [],
        activated: true,
    };

    const user = new UserModel({name, email, username, password, roles, activated,});

    const validation = await  validationError.uniqueCheck(await UserModel.isUnique(username, email));

    if (Object.keys(validation).length === 0) {
        const newUser = await user.save();
        console.log(newUser);
    } else {
        console.log(validation)
    }

}, 1100);
