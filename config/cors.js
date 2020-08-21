const cors = require("cors");

module.exports = cors({
    origin: (origin, callback) => {
        let string = process.env.CORS_ORIGIN.trim();
        string = string.split(" ").join("");
        const whiteListURIs = string.split(",");
        if (whiteListURIs.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }
});
