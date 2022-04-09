const ytstream = require('yt-stream');
const fs = require('fs');

(async () => {
    const stream = await ytstream.stream(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`, {
        quality: 'high',
        type: 'audio',
        highWaterMark: 1048576 * 32
    });
    stream.stream.pipe(fs.createWriteStream('some_song.mp3'));
    console.log(stream.video_url);
    console.log(stream.url);
})();