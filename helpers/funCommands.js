const path = require("path");
const { logger } = require(path.join(__dirname, "..", "models", "logger"));
const { trimAt, determinePhraseFromGuild } = require(path.join(
  __dirname,
  "..",
  "utils",
  "funUtils"
));
const jsonPhrases = require(`${__dirname}/../resources/thingsForRobotsToSay.json`);

async function handleActivate(message) {
  message.reply("gutterbot.exe ver 1.69 is online. nice.");
  if (
    message.content
      .toLowerCase()
      .startsWith(`${process.env.PREFIX}activate josh`)
  ) {
    if (
      message.author.id === "133810029743570944" ||
      message.author.id === "334150403015049216"
    ) {
      const hotJosh = await message.client.channels.fetch("747327258854948938");
      hotJosh.send(`<@429481922729738280>`);
    } else {
      message.reply("you don't have the right");
    }
  }
}

const handleAt = async (message) => {
  let at = message.content.split("<@")[1].split(">")[0];
  //if bot is mentioned
  if (at === message.client.user.id) {
    logger.info("Mention detected. Bweeeeep.");
    let phrase = determinePhraseFromGuild(message);
    trimAt(message);
    logger.info(`Sending a funny quip to [${message.guild.name}]`);
    return message.reply(phrase);
  }
  //if group bot belongs to is mentioned
  if (message.content.includes("<@&")) {
    let roleID = message.content.split("<@&")[1].split(">")[0];
    const botGuildObject = message.guild.members._cache.get(
      message.client.user.id
    );
    if (botGuildObject.roles.cache.has(roleID)) {
      logger.info("Group mention detected. Bweeeeep.");
      let phrase = determinePhraseFromGuild(message);
      trimAt(message);
      logger.info(`Sending a funny quip to [${message.guild.name}]`);
      return message.reply(phrase);
    }
  }
};

const handleHelp = async (message) => {
  if (
    message.content.toLowerCase().startsWith(`${process.env.PREFIX}help play`)
  ) {
    return message.reply(
      `Bzzt - The !play command is used to add videos to the queue. You can either provide a URL or a search term. If you provide a search term, the first video in the search results will be added to the queue. 
    Example: "!play never gonna give you up"`
    );
  }
  if (
    message.content.toLowerCase().startsWith(`${process.env.PREFIX}help skip`)
  ) {
    return message.reply(
      `The !skip command is used to skip the currently playing video. If there is another video in the queue, it will play next.
    Example: "!skip"`
    );
  }
  if (
    message.content.toLowerCase().startsWith(`${process.env.PREFIX}help stop`)
  ) {
    return message.reply(
      `The !stop command is used to stop the currently playing video and empty the queue.
    Example: "!stop"`
    );
  }
  if (message.content.toLowerCase().startsWith(`${process.env.PREFIX}help`)) {
    return message.reply(
      `I am a music bot by Dennis and Will. Possible commands are "!play", "!skip", and "!stop". Type "!help" followed by a command for more info about that command. You can also @ me for a funny reply.
    Example: "!help play"`
    );
  }
};

const handleNoCommand = (message) => {
  if (message.guildId === "747327258854948935") {
    return message.reply("bro you suck <:slugma:852187551766806578>");
  } else {
    return message.reply("bro you suck <:slugma:963669188914864169>");
  }
};

const handleExpose = (message) => {
  return message.reply(
    `This fuckin idiot ${message.author} said: "${message.client.editMap.get(
      message.guild.id
    )}"`
  );
};

module.exports = {
  handleAt,
  handleHelp,
  handleActivate,
  handleNoCommand,
  handleExpose,
};
