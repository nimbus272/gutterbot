const path = require("path");
const play = require("play-dl");
const ytStream = require("yt-stream");
const { createAudioResource } = require("@discordjs/voice");
const { logger } = require(path.join(__dirname, "..", "logger"));

module.exports = {

  playStream: async (sam) => {
    if (sam.songQueue.length === 0) {
      return;
    }
    let resource;
    logger.info(
      `Fetching audio stream and creating resource in [${sam.voiceChannel.name}] of [${sam.guildName}]`
    );
    try {
      let stream = await play.stream(sam.songQueue[0]);
      resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });
    } catch (err) {
      logger.error(err);
    }
    await sam.joinChannel();
    sam.audioPlayer.play(resource);
    sam.currentSong = sam.songQueue.shift();
    logger.info(
      `Playing [${sam.currentSong}] in [${sam.voiceChannel.name}] of [${sam.guildName}]`
    );
  },

  trimRequest: (message) => {
    let request = message.content.split(" ");
    request.shift();
    return request.join(" ");
  },

  populateQ: async (request, sam) => {
    let results;
    try {
      results = await ytStream.search(request);
    } catch (ytSearchErr) {
      logger.error(ytSearchErr);
      if (message.guildId === "747327258854948935") {
        return message.reply(
          `${request} my balls <:slugma:852187551766806578>`
        );
      }
      message.reply(`Search for ${request} failed`);
      return;
    }
    if (!results[0]) {
      logger.info(`Search for ${request} returned no results.`);
      sam.currentMessage.reply(`No results for that search term. bweeooo :c`);
      return;
    }
    sam.songQueue.push(results[0].url);
    sam.currentMessage.reply(`${results[0].url} has been added to the queue!`);
    logger.info(
      `[${sam.songQueue[0]}] has been added to the queue for channel: [${sam.voiceChannel.name}] of server: [${sam.guildName}]!`
    );
  },

  validateChannel: (message) => {
    if (!message.member.voice.channel) {
      if (message.guildId === "747327258854948935") {
        message.reply("In what channel? <:PATHETIC:778014063023357953>");
      } else {
        message.reply("In what channel? <:PATHETIC:963669463356563476>");
        return false;
      }
    } else {
      return true;
    }
  },
};
