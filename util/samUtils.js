const path = require("path");
const play = require("play-dl");
const ytStream = require("yt-stream");
const { joinVoiceChannel, createAudioResource } = require("@discordjs/voice");
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
    if (!sam.connection) {
      sam.connection = this.joinChannel(sam.voiceChannel);
    }

    sam.connection.subscribe(sam.audioPlayer);
    sam.audioPlayer.play(resource);
    sam.songQueue.shift();
  },

  joinChannel: async (voiceChannel) => {
    try {
      return joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
    } catch (joinChannelErr) {
      logger.error(joinChannelErr);
    }
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
    sam.songQueue.push(results[0].url);
    logger.info(`[${results[0].title}] has been added to the queue!`);
  },

  validateChannel: (message) => {
    if (!message.member.voice.channel) {
      if (message.guildId === "747327258854948935") {
        message.reply("In what channel? <:PATHETIC:778014063023357953>");
      } else {
        return message.reply("In what channel? <:PATHETIC:963669463356563476>");
      }
    }
  },
};
