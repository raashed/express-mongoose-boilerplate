let isSeedRunnable = false;

const updateSeedRunnable = value => {
    if (typeof value !== "boolean") {
        console.log("to enable seed boolean is required");
    }

    if (typeof value === "boolean") {
        isSeedRunnable = value;
    }

    if (isSeedRunnable) {
        require("./oAuthClient.seed");
        require("./user.seed");
    }
};

module.exports = updateSeedRunnable;
