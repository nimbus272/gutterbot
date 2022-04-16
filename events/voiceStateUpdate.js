const path = require("path");
const { logger } = require(path.join(__dirname, "..", "models", "logger.js"));
let timeout;
module.exports = {
  name: "voiceStateUpdate",
  execute(oldState, newState) {
      let channelMembers;
      if(!oldState.channelId){
         channelMembers = newState.guild.channels.cache.get(newState.channelId).members
      } else {
         channelMembers = newState.guild.channels.cache.get(oldState.channelId).members;
        }
        logger.info(channelMembers.entries().next().value);
    if (!newState.channel && channelMembers.size === 0) {
      if (oldState.timeout) {
        clearTimeout(oldState.timeout);
      }
      return;
    }

    if (newState.guild.id !== "747327258854948935") {
      return;
    }

    if (channelMembers.size !== 1) {
      if (oldState.timeout) {
        clearTimeout(oldState.timeout);
      }
      return;
    }
    if (
      channelMembers.has("961706313375703050") ||
      channelMembers.has("963619581346344991")
    ) {
      let sam = newState.channel.client.samMap.get(newState.guild.id);
      sam.audioPlayer.stop();
      sam.connection.destroy();
      sam.currentMessage.client.samMap.delete(sam.guildId);
      return;
    }

    newState.timeout = setTimeout(() => {
      let textChannel = newState.guild.channels.cache.find(
        (channel) => channel.name === "shit-posting"
      );
      textChannel.send(`<@${channelMembers.keys().next().value}> Alone in a discord server?`);
      textChannel.send(`<:PATHETIC:778014063023357953>`);
    }, 10000);
  },
};
