const path = require('path')
const {logger} = require(path.join(__dirname, '..', 'logger.js'));

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        logger.info(`Logged in as [${client.user.username}]!`);
    }
}