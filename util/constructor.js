function ServerAudioManager(connection, audioPlayer) {
  this.connection = connection;
  this.audioPlayer = audioPlayer;
  this.songQueue = [];
  this.connectionSubscribed = false;
  this.currentSong = null;
}

module.exports = ServerAudioManager;
