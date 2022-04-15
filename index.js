require("dotenv").config({ path: `${__dirname}/.env` }); //initialize dotenv
const Discord = require(`discord.js`); //import discord.js
const fs = require("fs");
const { REPL_MODE_STRICT } = require("repl");


// const winston = require("winston");

// const logConfiguration = {
//   transports: [
//     new winston.transports.File({
//       level: 'error',
//       filename: 'logs/error-logs.log'
//   }),
//   ],
//   format: winston.format.combine(
//     winston.format.timestamp({
//       format: 'MMM-DD-YYYY HH:mm:ss'
//     }),
//     winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
//   )
// };
// module.exports.logger = winston.createLogger(logConfiguration);


const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});

client.audioManagerMap = new Map();

const eventFiles = fs
  .readdirSync(`${__dirname}/events`)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`${__dirname}/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.CLIENT_TOKEN);