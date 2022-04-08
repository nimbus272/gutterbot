require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
}); //create new client

const queue = new Map();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {

    if (message.author.bot) {
        return;
    }

    if (!message.content.startsWith(process.env.PREFIX)) {
        return;
    }

    const serverQueue = queue.get(message.guild.id);

    if (message.content.toLowerCase.startsWith(`${process.env.PREFIX}play`)) {
        execute(message, serverQueue)
    } else if (message.content.toLowerCase.startsWith(`${process.env.PREFIX}skip`)) {
        skip(message, serverQueue)
    } else if (message.content.toLowerCase.startsWith(`${process.env.PREFIX}stop`)) {
        stop(message, serverQueue)
    } else {
        message.reply('bro you suck');
    }
});

async function execute(message, serverQueue) {
    const args = message.content.split(' ');
    args.shift();
    const request = args.join();

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        return message.reply('In what channel ::PATHETIC::');
    }
    const songInfo = await ytdl.getInfo(request);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if (!serverQueue) {
        const queueContract = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContract);
        queueContract.songs.push(song);

        try {
            let connection = await voiceChannel.join();
            queueContract.connection = connection;
            play(message.guild, queueContract.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.reply(`it broke lol`);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.reply(`${song.title} has been added to the queue!`);
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave()
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url)).on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    }).on("error", console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}


//make sure this line is the last line

client.login(process.env.CLIENT_TOKEN); //login bot using token