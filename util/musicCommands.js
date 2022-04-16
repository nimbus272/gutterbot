const path = require("path");
const {
  AudioPlayerStatus,
  createAudioPlayer,
  joinVoiceChannel,
} = require("@discordjs/voice");
const { trimRequest, populateQ, validateChannel } = require(path.join(
  __dirname,
  "samUtils"
));
const ServerAudioManager = require(path.join(__dirname, "serverAudioManager"));
const { logger } = require(path.join(__dirname, "..", "logger"));

const handleKill = async (message) => {
  const sam = message.client.samMap.get(message.guild.id);

  if (
    message.author.username === "nimbus272" ||
    message.author.username === "swill"
  ) {
    await message.reply(`:b:EACE`);
    if (!sam) {
      await message.client.destroy();
      process.exit();
    }
    if (sam.audioPlayer._state.status === AudioPlayerStatus.Playing) {
      sam.audioPlayer.stop();
      await sam.connection.destroy();
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
    `Stopping playback in channel: [${message.member.voice.channel.name}] of server: [${message.guild.name}]...`
  );
  sam.audioPlayer.stop();
  sam.songQueue = [];
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
    `Skipping in in channel: [${message.member.voice.channel.name}] of server: [${message.guild.name}]...`
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
      `Searching youtube for [${request}] from user: [${message.author.username}] in channel: [${message.member.voice.channel.name}] of server: [${message.guild.name}]...`
    );

    await populateQ(request, sam);
    await sam.playMusic();
  } else {
    logger.info("Cannot Join. Invalid Voice Channel. Bep.");
  }
};
module.exports = { handlePlay, handleSkip, handleStop, handleKill, handleInfo };
