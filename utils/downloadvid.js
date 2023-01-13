const ytdl = require("ytdl-core");
const fs = require("fs");
const url = ["https://youtu.be/PaxP28gzQZo", "https://youtu.be/o4K_u3xq5ek"]

function downloadvid(url){
    ytdl(url[1]).pipe(fs.createWriteStream("video.mp4"));
    }
    downloadvid(url)