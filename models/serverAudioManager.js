const path = require("path");
const {
  AudioPlayerStatus,
  createAudioPlayer,
  joinVoiceChannel,
} = require("@discordjs/voice");
const { playStream } = require(path.join(
  __dirname,
  "..",
  "utils",
  "playUtils"
));
const { logger } = require(path.join(__dirname, "logger"));

function ServerAudioManager(guildId, guildName) {
  this.connection = null;
  this.audioPlayer = null;
  this.guildName = guildName;
  this.songQueue = [];
  this.currentSong = null;
  this.huntin = false;
  this.guildId = guildId;
  this.voiceChannel = null;
  this.currentMessage = null;
  this.playMusic = async () => {
    if (this.audioPlayer._state.status !== AudioPlayerStatus.Playing) {
      await playStream(this);
    }
  };
  this.joinChannel = async () => {
    if (
      !this.connection ||
      this.connection.channelId !== this.voiceChannel.id
    ) {
      try {
        this.connection = await joinVoiceChannel({
          channelId: this.voiceChannel.id,
          guildId: this.voiceChannel.guild.id,
          adapterCreator: this.voiceChannel.guild.voiceAdapterCreator,
        });
        //Workaround suggested by Github users ramsydx and vittee in
        //the following thread: https://github.com/discordjs/discord.js/issues/9185
        this.connection.on("stateChange", (oldState, newState) => {
          const oldNetworking = Reflect.get(oldState, "networking");
          const newNetworking = Reflect.get(newState, "networking");

          const networkStateChangeHandler = (
            oldNetworkState,
            newNetworkState
          ) => {
            const newUdp = Reflect.get(newNetworkState, "udp");
            clearInterval(newUdp?.keepAliveInterval);
          };

          oldNetworking?.off("stateChange", networkStateChangeHandler);
          newNetworking?.on("stateChange", networkStateChangeHandler);
        });
        //Workaround end
      } catch (joinChannelErr) {
        logger.error(joinChannelErr);
      }
      this.connection.subscribe(this.audioPlayer);
    }
  };

  createAudioPlayerWithListeners(this);
}

function createAudioPlayerWithListeners(sam) {
  let player = createAudioPlayer();
  let timeout;
  player.addListener(AudioPlayerStatus.Idle, () => {
    if (sam.songQueue.length > 0) {
      playStream(sam);
    } else {
      timeout = setTimeout(() => {
        logger.info(`Destroying voice connection for [${sam.guildName}]`);
        try {
          sam.connection.destroy();
        } catch (err) {
          logger.error(err);
        }
        sam.currentMessage.client.samMap.delete(sam.guildId);
      }, 60000);
    }
  });
  player.addListener(AudioPlayerStatus.Playing, () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });
  sam.audioPlayer = player;
}

module.exports = ServerAudioManager;
