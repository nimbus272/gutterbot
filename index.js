require("dotenv").config({ path: `${__dirname}/.env` }); //initialize dotenv
const Discord = require(`discord.js`); //import discord.js
const fs = require("fs");

const logger = require("winston");
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});

client.queueObject = new Map();

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
