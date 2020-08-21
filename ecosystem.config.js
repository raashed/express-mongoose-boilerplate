module.exports = {
    apps: [{
        name: "basic-server",
        script: "./bin/www.js",
        env: {
            NODE_ENVIRONMENT: "production",
            HOST_NAME: "localhost"
        }
    }]
}
