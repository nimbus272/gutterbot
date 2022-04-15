const path = require("path");
const { AudioPlayerStatus, createAudioPlayer } = require("@discordjs/voice");
const {playStream} = require(path.join(__dirname, "samUtils"));

function ServerAudioManager(
  connection,
  guildId,
  voiceChannel,
  guildName
) {
  this.connection = connection;
  this.audioPlayer = null;
  this.guildName = guildName;
  this.songQueue = [];
  this.currentSong = null;
  this.huntin = false;
  this.guildId = guildId;
  this.voiceChannel = voiceChannel;
  this.playMusic = async (message) => {
    if (
      this.audioPlayer._state.status !== AudioPlayerStatus.Playing
    ) {
      //play song
      await playStream(this);
    }
    message.reply(
      `beep boop ${this.songQueue[0]} has been added to the queue :robot:`
    );
  }

  createAudioPlayerWithListeners(this);
  
}

function createAudioPlayerWithListeners(sam) {
  let player = createAudioPlayer();
  let timeout;
  player.addListener(AudioPlayerStatus.Idle,  () => {
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
