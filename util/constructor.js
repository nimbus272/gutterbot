
function ServerAudioManager(connection, audioPlayer, guildId, voiceChannel ) {
  this.connection = connection;
  this.audioPlayer = audioPlayer;
  this.songQueue = [];
  this.connectionSubscribed = false;
  this.currentSong = null;
  this.huntin = false;
  this.guildId = guildId;
  this.voiceChannel = voiceChannel;
  this.addListeners = async () => {
}

module.exports = ServerAudioManager;
