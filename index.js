require("dotenv").config(); //initialize dotenv
const Discord = require("discord.js"); //import discord.js
const play = require("play-dl");
const ytStream = require("yt-stream");
const {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  createAudioPlayer,
  joinVoiceChannel,
  getVoiceConnection,
  createAudioResource,
} = require("@discordjs/voice");

const logger = require("winston");

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
  },
});

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});

let queue = [];
let connection = {};
client.on("ready", () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  if (!message.content.startsWith(process.env.PREFIX)) {
    return;
  }
  if (message.author.username.toLowerCase() === "ratcarl") {
    if (message.content.startsWith(process.env.PREFIX)) {
      message.reply("bad rat!");
      return;
    }
  }
  if (message.content.toLowerCase().startsWith(`${process.env.PREFIX}play`)) {
    //get search from arguments
    let args = message.content.split(" ");
    args.shift();
    const request = args.join(" ");
    //join voice channel of user if in channel
    connection = joinChannel(message);
    logger.info(`Searching youtube for ${request}`);
    let results = await ytStream.search(request);
    queue.push(results[0].url);
    logger.info(
      `Player State ${player._state.status} Status ${AudioPlayerStatus.Idle}`
    );
    //if audio is not currently playing
    if (player._state.status === AudioPlayerStatus.Idle) {
      //play song
      playStream();
    }
    message.reply(`Down with Riley! ${results[0].url}`);
  } else if (
    message.content.toLowerCase().startsWith(`${process.env.PREFIX}skip`)
  ) {
    if (!player._state.status === AudioPlayerStatus.Playing) {
      message.reply("Nah...");
      return;
    }
    player.stop();
  } else if (
    message.content.toLowerCase().startsWith(`${process.env.PREFIX}stop`)
  ) {
    if (!player._state.status === AudioPlayerStatus.Playing) {
      message.reply("Nah...");
      return;
    }
    queue = [];
    player.stop();
  } else {
    message.reply("bro you suck ::PATHETIC::");
  }
});

async function playStream() {
  if (queue.length === 0) {
    return;
  }
  try {
    let stream = await play.stream(queue[0]);
    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    console.log(player._state);
    player.play(resource);
    connection.subscribe(player);
    queue.shift();
  } catch (err) {
    logger.info(err);
  }
}
player.on("idle", () => {
  if (queue.length > 0) {
    playStream();
  } else {
    setTimeout(() => {
      connection.destroy();
    }, 120000);
  }
});

const joinChannel = (message) => {
  const voiceChannel = message.member.voice.channel;
  if (null === voiceChannel) {
    return message.reply("In what channel? ::PATHETIC::");
  }

  return joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });
};

client.login(process.env.CLIENT_TOKEN);
