const path = require("path");
const { logger } = require(path.join(__dirname, "..", "models", "logger.js"));

module.exports = {
  name: "voiceStateUpdate",
  execute(oldState, newState) {
      let timeout;
    if (newState.guild.id !== "747327258854948935") {
      return;
    }
    
    if ( !newState.channel||newState.channel.members.size !== 1 )  {
      clearTimeout(timeout);
      return;
    }
    timeout = setTimeout(() => {
      let textChannel = newState.guild.channels.cache.find(
        (channel) => channel.name === "shit-posting"
      );
      textChannel.send(`<@${newState.id}> Alone in a discord server?`);
      textChannel.send(`<:PATHETIC:778014063023357953>`);
    }, 30000);
  },
};
