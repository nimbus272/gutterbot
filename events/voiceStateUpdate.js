const path = require("path");
const { setTimeoutForPathetic } = require("../utils/voiceUtils");
const { samLeaveWhenAlone } = require(path.join(
  __dirname,
  "..",
  "utils",
  "voiceUtils"
));
const { logger } = require(path.join(__dirname, "..", "models", "logger.js"));

module.exports = {
  name: "voiceStateUpdate",
  execute(oldState, newState) {
    let handled;
    if (
      newState.guild.id === "747327258854948935" ||
      oldState.guild.id === "747327258854948935"
    ) {
      let voiceChannel = oldState.channelId
        ? newState.guild.channels.cache.get(oldState.channelId)
        : newState.guild.channels.cache.get(newState.channelId);
      let newVoiceChannel;
      if (
        voiceChannel === newState.guild.channels.cache.get(oldState.channelId)
      ) {
        newVoiceChannel = newState.guild.channels.cache.get(newState.channelId);
      }

      if (voiceChannel.members.size === 1) {
        handled = samLeaveWhenAlone(voiceChannel, newState);
        if (!newState.client.stateMap.get(newState.id)) {
          setTimeoutForPathetic(voiceChannel, newState);
        }
      }

      if (newVoiceChannel) {
        if (newVoiceChannel.members.size === 1) {
          if (!handled) {
            samLeaveWhenAlone(voiceChannel, newState);
          }
          if (!newState.client.stateMap.get(newState.id)) {
            setTimeoutForPathetic(newVoiceChannel, newState);
          }
        }
      }

      if (newState.channelId) {
        let channelMembers = newState.channel.members;
        if (channelMembers.size > 1) {
          channelMembers.forEach((_value, key) => {
            if (newState.client.stateMap.get(key)) {
              clearTimeout(newState.client.stateMap.get(key).timeout);
              newState.client.stateMap.delete(key);
            }
          });
        }
      } else {
        if (newState.client.stateMap.get(newState.id)) {
          clearTimeout(newState.client.stateMap.get(newState.id).timeout);
          newState.client.stateMap.delete(newState.id);
        }
      }

      if (newState.client.stateMap.size > 0) {
        newState.client.stateMap.forEach((value, key) => {
          if (value.guildId !== "747327258854948935") {
            clearTimeout(value.timeout);
            newState.client.stateMap.delete(key);
          }
        });
      }
    } else {
      let voiceChannel = oldState.channelId
        ? newState.guild.channels.cache.get(oldState.channelId)
        : newState.guild.channels.cache.get(newState.channelId);
      let newVoiceChannel;
      if (
        voiceChannel === newState.guild.channels.cache.get(oldState.channelId)
      ) {
        newVoiceChannel = newState.guild.channels.cache.get(newState.channelId);
      }

      if (voiceChannel.members.size === 1) {
        handled = samLeaveWhenAlone(voiceChannel, newState);
      }

      if (newVoiceChannel) {
        if (newVoiceChannel.members.size === 1) {
          if (!handled) {
            samLeaveWhenAlone(voiceChannel, newState);
          }
        }
      }
    }
  },
};
