const path = require("path");
const { setTimeoutForPathetic } = require("../utils/voiceUtils");
const { samLeaveWhenAlone } = require(path.join(__dirname, "..", "utils", "voiceUtils"));
const { logger } = require(path.join(__dirname, "..", "models", "logger.js"));

module.exports = {
  name: "voiceStateUpdate",
  execute(oldState, newState) {
    let handled;
    if (
      newState.guild.id === "812849394771820604" ||
      oldState.guild.id === "812849394771820604"
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
          channelMembers.forEach((value, key) => {
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
          if (value.guildId !== "812849394771820604") {
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

    // if (
    //   channelMembers.has("961706313375703050") ||
    //   channelMembers.has("963619581346344991")
    // ) {
    //   let sam = newState.channel.client.samMap.get(newState.guild.id);
    //   sam.audioPlayer.stop();
    //   sam.connection.destroy();
    //   sam.currentMessage.client.samMap.delete(sam.guildId);
    //   return;
    // }

    //   if (newState.guild.id !== "812849394771820604") {
    //     return;
    //   }

    //   let channelMembers;
    //   let oldMembers;
    //   let newMembers;
    //   if (oldState.channelId && newState.channelId) {
    //     oldMembers = newState.guild.channels.cache.get(oldState.channelId).members;
    //     newMembers = newState.guild.channels.cache.get(newState.channelId).members
    //     channelMembers = new Map([
    //       ...oldMembers,
    //       ...newMembers,
    //     ]);
    //   } else if (!oldState.channelId) {
    //     channelMembers = newState.guild.channels.cache.get(
    //       newState.channelId
    //     ).members;
    //   } else {
    //     channelMembers = newState.guild.channels.cache.get(
    //       oldState.channelId
    //     ).members;
    //   }
    //   if (channelMembers.size === 0) {
    //     if (oldState.timeout) {
    //       clearTimeout(oldState.timeout);
    //     }
    //     return;
    //   }

    //   if (oldMembers && newMembers) {
    //     if (oldMembers.size < 2 && newMembers.size < 2) {
    //       newState.timeout = setTimeout(() => {
    //         let textChannel = newState.guild.channels.cache.find(
    //           (channel) => channel.name === "general"
    //         );
    //         channelMembers.forEach((value, key) => {
    //           textChannel.send(`<@${key}> Alone in a discord server?`);
    //           //<:PATHETIC:778014063023357953>
    //           textChannel.send(`<:colby2:888677949367259206>`);
    //         });
    //       }, 10000);
    //     }
    //     return;
    //   }

    //   if (channelMembers.size !== 1) {
    //     if (oldState.timeout) {
    //       clearTimeout(oldState.timeout);
    //     }
    //     return;
    //   }

    //   if (
    //     channelMembers.has("961706313375703050") ||
    //     channelMembers.has("963619581346344991")
    //   ) {
    //     let sam = newState.channel.client.samMap.get(newState.guild.id);
    //     sam.audioPlayer.stop();
    //     sam.connection.destroy();
    //     sam.currentMessage.client.samMap.delete(sam.guildId);
    //     return;
    //   }

    //   newState.timeout = setTimeout(() => {
    //     let textChannel = newState.guild.channels.cache.find(
    //       (channel) => channel.name === "general"
    //     );
    //     textChannel.send(
    //       `<@${channelMembers.keys().next().value}> Alone in a discord server?`
    //     );
    //     //<:PATHETIC:778014063023357953>
    //     textChannel.send(`<:colby2:888677949367259206>`);
    //   }, 30000);
  },
};
