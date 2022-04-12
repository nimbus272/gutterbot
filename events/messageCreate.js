const play = require("play-dl");
const ytStream = require("yt-stream");
const {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  createAudioPlayer,
  joinVoiceChannel,
  createAudioResource,
} = require("@discordjs/voice");
const logger = require("winston");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) {
      return;
    }

    if (!message.content.startsWith(process.env.PREFIX)) {
      return;
    }

    const guildId = message.guildId;
    let currentQueueObject = message.client.queueObject.get(guildId);

    if (message.content.toLowerCase().startsWith(`${process.env.PREFIX}play`)) {

      const guildId = message.guildId;
      const voiceChannel = message.member.voice.channel;
      //get search from arguments

      let args = message.content.split(" ");
      args.shift();
      const request = args.join(" ");
      //join voice channel of user if in channel
      let connection = await joinChannel(message, voiceChannel);

      if (voiceChannel === null) {
        return;
      }

      let results;
      try {
        logger.info(`Searching youtube for ${request}`);
        results = await ytStream.search(request);

        if (currentQueueObject) {
          currentQueueObject.songQueue.push(results[0].url);
          logger.info(`${results[0].title} has been added to the queue!`);
        } else {
          const player = createAudioPlayer({
            behaviors: [NoSubscriberBehavior.Stop],
          });
          let queueObject = {
            connection: connection,
            audioPlayer: player,
            songQueue: [],
          };
          let timeout;
          queueObject.songQueue.push(results[0].url);
          queueObject.audioPlayer.addListener(AudioPlayerStatus.Idle, () => {
            if (message.client.queueObject.get(guildId).songQueue.length > 0) {
              playStream(message, message.client.queueObject.get(guildId));
            } else {
              timeout = setTimeout(() => {
                message.client.queueObject.get(message.guildId).connection.destroy();
              }, 120000);
            }
          });
          queueObject.audioPlayer.addListener(AudioPlayerStatus.Playing, () => {
            if (timeout) {
              clearTimeout(timeout);
            }
          });
          message.client.queueObject.set(guildId, queueObject);
          currentQueueObject = message.client.queueObject.get(guildId);
          logger.info(`${results[0].title} has been added to the queue!`);
        }
        //queue.push(results[0].url);
      } catch (ytSearchErr) {
        logger.error(`${ytSearchErr.toString()}`);
        message.reply(`Search for ${request} failed.`);
        return;
      }
      
      //if audio is not currently playing
      if (
        currentQueueObject.audioPlayer._state.status !==
        AudioPlayerStatus.Playing
      ) {
        //play song
        playStream(message, currentQueueObject);
      }
      message.reply(`beep boop ${results[0].url} has been added to the queue :bee:`);
    } else if (
      message.content.toLowerCase().startsWith(`${process.env.PREFIX}skip`)
    ) {
      if (
        currentQueueObject.audioPlayer._state.status !==
        AudioPlayerStatus.Playing
      ) {
        message.reply("Nah...");
        return;
      }
      logger.info(`Skipping...`);
      currentQueueObject.audioPlayer.stop();
    } else if (
      message.content.toLowerCase().startsWith(`${process.env.PREFIX}stop`)
    ) {
      if (
        currentQueueObject.audioPlayer._state.status !==
        AudioPlayerStatus.Playing
      ) {
        message.reply("Nah...");
        return;
      }
      logger.info(`Stopping...`);
      currentQueueObject.audioPlayer.stop();
      currentQueueObject.songQueue = [];
    } else if (
      message.content.toLowerCase().startsWith(`${process.env.PREFIX}kill`)
    ) {
      if (
        message.author.username === "nimbus272" ||
        message.author.username === "swill"
      ) {
        await message.reply(`:b:EACE`);
        if (
          currentQueueObject.audioPlayer._state.status ===
          AudioPlayerStatus.Playing
        ) {
          currentQueueObject.audioPlayer.stop();
          currentQueueObject.connection.destroy();
        }
        process.exit();
      } else {
        return message.reply("you don't have the right");
      }
    } else {
      return message.reply("bro you suck :slugma:");
    }
  },
};

async function playStream(message, currentQueueObject) {
  if (currentQueueObject.songQueue.length === 0) {
    return;
  }
  try {
    let stream = await play.stream(
      currentQueueObject.songQueue[0]
    );
    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    currentQueueObject.audioPlayer.play(resource);

    currentQueueObject
      .connection.subscribe(
        currentQueueObject.audioPlayer
      );
    currentQueueObject.songQueue.shift();
  } catch (err) {
    logger.error(`${err.toString()}`);
  }
}

const joinChannel = async (message, voiceChannel) => {
  if (null === voiceChannel) {
    return message.reply("In what channel? :PATHETIC:");
  }
  try {
    return joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
  } catch (joinChannelErr) {
    logger.error(`${joinChannelErr.toString()}`);
  }
};
