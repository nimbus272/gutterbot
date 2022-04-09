require("dotenv").config(); //initialize dotenv
const Discord = require("discord.js"); //import discord.js
const {
  createAudioPlayer,
  joinVoiceChannel,
  getVoiceConnection,
  createAudioResource,
} = require("@discordjs/voice");

const ytStream = require("yt-stream");
const ffmpeg = require("ffmpeg");
const fs = require("fs");
const logger = require("winston");

const player = createAudioPlayer();

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});

const queue = [];

client.on("ready", () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  if (!message.content.startsWith(process.env.PREFIX)) {
    return;
  }

  if (message.content.toLowerCase().startsWith(`${process.env.PREFIX}play`)) {
    //get search from arguments
    let args = message.content.split(" ");
    args.shift();
    const request = args.join(" ");
    let connection = joinChannel(message);
    ytStream.search(request).then((results) => {
      queue.push(results[0].url);

      getMp3(connection);
    });

    //message.reply(queue[0]);
    //join voice channel of user if in channel

    //logger.info(request);

    //if audio is not currently playing

    //search youtube and push to the queue

    //play music while queue is not empty

    //play function will shift url when finished and loop over elements
    //else

    //search youtube and push to the queue
  } else {
    logger.info("bro you suck");
  }
});

async function getMp3(connection) {
  ytStream
    .stream(queue[0], {
      quality: "high",
      type: "audio",
      highWaterMark: 1048576 * 32,
    })
    .then((stream) => {
      try {
        stream.stream.pipe(fs.createWriteStream("temp.mp3")).on("finish", () => {
        logger.info("done getting mp3");
        const resource = createAudioResource("./temp.mp3");
        connection.subscribe(player);
        player.play(resource);
        });
        
      } catch (err) {
        logger.info(err);
      }
      
    });
}

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

async function playYtSong(message) {
  let args = message.content.split(" ");
  args.shift();
  const request = args.join(" ");

  const voiceChannel = message.member.voice.channel;
  if (null === voiceChannel) {
    return message.reply("In what channel? ::PATHETIC::");
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  (async () => {
    let results = await ytStream.search(request);
    queue.push(results[0].url);
    logger.info(results);
  })();

  message.reply(
    `Can't play just yet, we're getting there. In the meantime, here's the link!`
  );

  connection.destroy();
}
client.login(process.env.CLIENT_TOKEN);
