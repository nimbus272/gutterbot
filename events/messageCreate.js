const play = require("play-dl");
const ytSearch = require('yt-search');
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
            connection = joinChannel(message);
            logger.info(`Searching youtube for ${request}`);
            let results = await ytSearch(request);
            queue.push(results.videos[0].url);
            logger.info(
              `Player State ${player._state.status} Status ${AudioPlayerStatus.Idle}`
            );
            //if audio is not currently playing
            if (player._state.status === AudioPlayerStatus.Idle) {
              //play song
              playStream();
            }
            message.reply(results.videos[0].url);
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