const path = require("path");
const { logger } = require(path.join(__dirname, "..", "models", "logger"));

module.exports = {
  samLeaveWhenAlone: (voiceChannel, newState) => {
    if (
      voiceChannel.members.has("961706313375703050") ||
      voiceChannel.members.has("963619581346344991")
    ) {
      let sam = newState.client.samMap.get(newState.guild.id);
      sam.audioPlayer.stop();
      try {
        sam.connection.destroy();
      } catch (err) {
        logger.error(err);
      }

      newState.client.samMap.delete(sam.guildId);
      return true;
    }
  },

  setTimeoutForPathetic: (voiceChannel, newState) => {
    let memberId = voiceChannel.members.keys().next().value;

    let timeout = setTimeout(() => {
      let textChannel = newState.guild.channels.cache.find(
        (channel) => channel.name === "shit-posting"
      );
      textChannel.send(`<@${memberId}> Alone in a discord server?`);
      textChannel.send(`<:PATHETIC:778014063023357953>`);
      newState.client.stateMap.delete(memberId);
      //45000
    }, 45000);
    newState.client.stateMap.set(memberId, {
      timeout: timeout,
      guildId: voiceChannel.guildId,
    });
  },
};
