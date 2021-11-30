const {UserModel, UserGender} = require("../models/user.model");
const validationError = require("../utils/validationError");

setTimeout(async () => {
    const userContent = {
        email: "rashed.rsd4@gmail.com",
        username: "raashed",
        password: "P@$$w0rd",
        superAdmin: true,
        personal: {
            firstName: "Md. Rashedul",
            lastName: "Islam",
            phone: [
                "123456",
                "789123",
            ],
            gender: UserGender.male
        }
    };

    const user = new UserModel(userContent);
    const validation = await  validationError.uniqueCheck(await UserModel.isUnique(userContent.username, userContent.email));

    if (Object.keys(validation).length === 0) {
        const newUser = await user.save();
        console.log(newUser);
    } else {
        console.log(validation)
    }

}, 1100);
