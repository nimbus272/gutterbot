const logger = require("winston");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        logger.info(`Logged in as ${client.user.tag}!`);
    }
}