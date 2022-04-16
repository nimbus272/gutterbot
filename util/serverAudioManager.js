const path = require("path");
const {
  AudioPlayerStatus,
  createAudioPlayer,
  joinVoiceChannel,
} = require("@discordjs/voice");
const { playStream } = require(path.join(__dirname, "samUtils"));
const { logger } = require(path.join(__dirname, "..", "logger"));

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
      //play song
      await playStream(this);
    }
  };
  this.joinChannel = async () => {
    if (!this.connection) {
      try {
        this.connection = await joinVoiceChannel({
          channelId: this.voiceChannel.id,
          guildId: this.voiceChannel.guild.id,
          adapterCreator: this.voiceChannel.guild.voiceAdapterCreator,
        });
      } catch (joinChannelErr) {
        logger.error(joinChannelErr);
      }
    }
    this.connection.subscribe(this.audioPlayer);
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
        sam.connection.destroy();
        sam.connection = null;
      }, 120000);
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
