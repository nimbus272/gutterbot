const path = require("path");
//createAudioPlayer and joinVoiceChannel are necessary here
const {
  AudioPlayerStatus,
  createAudioPlayer,
  joinVoiceChannel,
} = require("@discordjs/voice");
const { trimRequest, populateQ, validateChannel } = require(path.join(
  __dirname, "..", "utils",
  "playUtils"
));
const ServerAudioManager = require(path.join(__dirname, "..", "models", "serverAudioManager"));
const { logger } = require(path.join(__dirname, "..", "models", "logger"));

const handleKill = async (message) => {
  const sam = message.client.samMap.get(message.guild.id);

  if (
    message.author.id === "133810029743570944" ||
    message.author.id === "334150403015049216"
  ) {
    await message.reply(`:b:EACE`);
    if (!sam) {
      await message.client.destroy();
      process.exit();
    }
    if (sam.audioPlayer._state.status === AudioPlayerStatus.Playing) {
      sam.audioPlayer.stop();
      try {
        await sam.connection.destroy();
      } catch(err) {
        logger.error(error);
      }
      
    }
    await message.client.destroy();
    process.exit();
  } else {
    return message.reply("you don't have the right");
  }
};

const handleStop = async (message) => {
  const sam = message.client.samMap.get(message.guildId);
  if (!sam) {
    return message.reply("Why don't you ask me later...");
  }
  if (sam.audioPlayer._state.status !== AudioPlayerStatus.Playing) {
    message.reply("I don't really feel like it...");
    return;
  }
  message.react("💯");
  logger.info(
    `Stopping playback in channel: [${sam.voiceChannel.name}] of server: [${message.guild.name}]...`
  );
  sam.audioPlayer.stop();
  try {
    sam.connection.destroy();
  } catch (err) {
    logger.error(err);
  }
  
  sam.currentMessage.client.samMap.delete(sam.guildId);
};

const handleSkip = async (message) => {
  const sam = message.client.samMap.get(message.guildId);
  if (!sam) {
    return message.reply("I don't really feel like it...");
  }
  if (sam.audioPlayer._state.status !== AudioPlayerStatus.Playing) {
    message.reply("I don't really feel like it...");
    return;
  }
  logger.info(
    `Skipping in in channel: [${sam.voiceChannel.name}] of server: [${message.guild.name}]...`
  );
  sam.audioPlayer.stop();
  message.react("💯");
};

const handleInfo = async (message) => {
  const sam = message.client.samMap.get(message.guildId);
  if (!sam) {
    return message.reply("...");
  }
  if (sam.audioPlayer._state.status !== AudioPlayerStatus.Playing) {
    message.reply("I'm not playing anything..? lmao :joy:");
    return;
  }
  return message.reply(`I'm currently playing: ${sam.currentSong}`);
};

const handlePlay = async (message) => {
  if (validateChannel(message)) {
    let sam = message.client.samMap.get(message.guild.id);
    if (!sam) {
      sam = await new ServerAudioManager(message.guildId, message.guild.name);
      message.client.samMap.set(sam.guildId, sam);
    }
    sam.currentMessage = message;
    sam.voiceChannel = message.member.voice.channel;
    sam.connection = sam.joinChannel();
    //get search from arguments
    let request = trimRequest(message);

    logger.info(
      `Searching youtube for [${request}] from user: [${message.author.username}] in channel: [${sam.voiceChannel.name}] of server: [${message.guild.name}]...`
    );

    await populateQ(request, sam);
    await sam.playMusic();
  } else {
    logger.info("Cannot Join. Invalid Voice Channel. Bep.");
  }
};
module.exports = { handlePlay, handleSkip, handleStop, handleKill, handleInfo };
