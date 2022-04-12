const play = require("play-dl");
const ytStream = require('yt-stream');
const {
    AudioPlayerStatus,
    createAudioPlayer,
    joinVoiceChannel,
    createAudioResource,
  } = require("@discordjs/voice");
const logger = require("winston");

const player = createAudioPlayer();
let queue = [];
let connection = {};

module.exports = {
    name: 'messageCreate',
    async execute(message) {
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
            //join voice channel of user if in channel
            connection = await joinChannel(message);

            if (message.member.voice.channel === null) {
                return;
            }
            
            let results;
            try {
                logger.info(`Searching youtube for ${request}`);
                results = await ytStream.search(request);
                queue.push(results[0].url);
            } catch (ytSearchErr) {
                logger.error(`${ytSearchErr.toString()}  Caught line 44 messageCreate.js`);
                message.reply(`Search for ${request} failed.`);
                return;
            }
            logger.info(`${results[0].title} has been added to the queue!`)
            //if audio is not currently playing
            if (player._state.status === AudioPlayerStatus.Idle) {
              //play song
              playStream();
            }
            message.reply(results[0].url);
          } else if (
            message.content.toLowerCase().startsWith(`${process.env.PREFIX}skip`)
          ) {
            if (!player._state.status === AudioPlayerStatus.Playing) {
              message.reply("Nah...");
              return;
            }
            logger.info(`Skipping...`);
            player.stop();
          } else if (
            message.content.toLowerCase().startsWith(`${process.env.PREFIX}stop`)
          ) {
            if (!player._state.status === AudioPlayerStatus.Playing) {
              message.reply("Nah...");
              return;
            }
            queue = [];
            logger.info(`Stopping...`);
            player.stop();
          } else if (message.content.toLowerCase().startsWith(`${process.env.PREFIX}kill`)) {
            await message.reply(`:b:EACE`);
            if (player._state.status === AudioPlayerStatus.Playing) {
                player.stop();
                connection.destroy();
            }
            process.exit();
          } else {
            message.reply("bro you suck ::slugma::");
          }
    }
}

async function playStream() {
    if (queue.length === 0) {
      return;
    }
    try {
      let stream = await play.stream(queue[0]);
      let resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });
      player.play(resource);
      connection.subscribe(player);
      queue.shift();
    } catch (err) {
      logger.error(`${err.toString()}  Caught line 100 at messageCreate.js`);
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

const joinChannel = async (message) => {
    const voiceChannel = message.member.voice.channel;
    if (null === voiceChannel) {
      return message.reply("In what channel? ::PATHETIC::");
    }
    try {
        return joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          });
    } catch (joinChannelErr) {
        logger.error(`${joinChannelErr.toString()}  Caught line 126 at messageCreate.js`);
    }
};