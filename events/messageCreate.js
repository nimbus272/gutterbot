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

let queue = [];
let connection = {};

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

        if (message.client.queue.get(guildId)) {
          message.client.queue.get(guildId).songQueue.push(results[0].url);
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
            if (message.client.queue.get(guildId).songQueue.length > 0) {
              playStream(message);
            } else {
              timeout = setTimeout(() => {
                message.client.queue.get(message.guildId).connection.destroy();
              }, 120000);
            }
          });
          queueObject.audioPlayer.addListener(AudioPlayerStatus.Playing, () => {
            if (timeout) {
              clearTimeout(timeout);
            }
          })
          message.client.queue.set(guildId, queueObject);
        }
        //queue.push(results[0].url);
      } catch (ytSearchErr) {
        logger.error(`${ytSearchErr.toString()}`);
        message.reply(`Search for ${request} failed.`);
        return;
      }
      logger.info(`${results[0].title} has been added to the queue!`);
      //if audio is not currently playing
      if (
        message.client.queue.get(guildId).audioPlayer._state.status !==
        AudioPlayerStatus.Playing
      ) {
        //play song
        playStream(message);
      }
      message.reply(results[0].url);
    } else if (
      message.content.toLowerCase().startsWith(`${process.env.PREFIX}skip`)
    ) {
      if (
        message.client.queue.get(guildId).audioPlayer._state.status !==
        AudioPlayerStatus.Playing
      ) {
        message.reply("Nah...");
        return;
      }
      logger.info(`Skipping...`);
      message.client.queue.get(guildId).audioPlayer.stop();
    } else if (
      message.content.toLowerCase().startsWith(`${process.env.PREFIX}stop`)
    ) {
      if (
        message.client.queue.get(guildId).audioPlayer._state.status !==
        AudioPlayerStatus.Playing
      ) {
        message.reply("Nah...");
        return;
      }
      logger.info(`Stopping...`);
      message.client.queue.get(guildId).audioPlayer.stop();
      message.client.queue.get(guildId).songQueue = [];
    } else if (
      message.content.toLowerCase().startsWith(`${process.env.PREFIX}kill`)
    ) {
      await message.reply(`:b:EACE`);
      if (
        message.client.queue.get(guildId).audioPlayer._state.status ===
        AudioPlayerStatus.Playing
      ) {
        message.client.queue.get(guildId).audioPlayer.stop();
        message.client.queue.get(guildId).connection.destroy();
      }
      process.exit();
    } else {
      message.reply("bro you suck ::slugma::");
    }
  },
};

async function playStream(message) {
  if (message.client.queue.get(message.guildId).songQueue.length === 0) {
    return;
  }
  try {
    let stream = await play.stream(
      message.client.queue.get(message.guildId).songQueue[0]
    );
    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    message.client.queue.get(message.guildId).audioPlayer.play(resource);

    message.client.queue
      .get(message.guildId)
      .connection.subscribe(
        message.client.queue.get(message.guildId).audioPlayer
      );
    message.client.queue.get(message.guildId).songQueue.shift();
  } catch (err) {
    logger.error(`${err.toString()}`);
  }
}

function onIdle(message) {
  if (queue.length > 0) {
    playStream(message);
  } else {
    setTimeout(() => {
      message.client.queue.get(message.guildId).connection.destroy();
    }, 120000);
  }
}
// player.on("idle", () => {
//     if (queue.length > 0) {
//       playStream();
//     } else {
//       setTimeout(() => {
//         connection.destroy();
//       }, 120000);
//     }
//   });

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
    logger.error(`${joinChannelErr.toString()}`);
  }
};
