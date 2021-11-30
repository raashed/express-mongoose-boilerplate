const uniqueCheck = async isUnique => {
    const validationError = {};
    await Object.keys(isUnique).forEach(key => {
        validationError[key] = `"${isUnique[key]}" is already been taken.`;
    });
    return validationError;
}

const requiredCheck = async errors => {
    const validationError = {};
    await Object.keys(errors).forEach(key => {
        validationError[errors[key].path] = errors[key].message;
    });
    return validationError;
}


module.exports = {uniqueCheck, requiredCheck};
