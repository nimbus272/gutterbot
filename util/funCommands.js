const path = require("path");
const {logger} = require(path.join(__dirname, "..", "logger"));
const talk = require(`${__dirname}/../util/thingsForRobotsToSay.json`);

async function reroll(speak) {
  if (speak === talk.phrases[7]) {
    logger.info(
      "Rerolled anti-riley propaganda. If it gets through now, it was fate."
    );
    speak = talk.phrases[Math.floor(Math.random() * talk.phrases.length)];
  }
  return speak;
}

async function activate(message) {
  message.reply("gutterbot.exe ver 1.69 is online. nice.");
  return;
}

async function reroll_tongues(in_tongues) {
  if (in_tongues === talk.huntin_phrases[7]) {
    logger.info(
      "Rerolled anti-riley propaganda. If it gets through now, it was fate."
    );
    in_tongues =
      talk.huntin_phrases[
        Math.floor(Math.random() * talk.huntin_phrases.length)
      ];
  }
  return in_tongues;
}

//  if (message.guildId === "747327258854948935")
//gutterbot id = "<@961706313375703050>"
//gutterbot-testing id = "<@963619581346344991>"

const trimAt = async (message) => {
  let at = message.content.split("<@")[1].split(">")[0];
  message.content = message.content.replace(`<@${at}>`, "");
  logger.info("Successfully trimmed @ from search request.");
  return message;
};

const handleAt = async (message) => {
  let in_tongues =
    talk.huntin_phrases[Math.floor(Math.random() * talk.huntin_phrases.length)];
  let speak = talk.phrases[Math.floor(Math.random() * talk.phrases.length)];
  if (
    message.content.includes("<@963619581346344991>") ||
    message.content.includes("<@961706313375703050>")
  ) {
    let at = message.content.split("<@")[1].split(">")[0];
    if (at === message.client.user.id) {
      logger.info("Mention detected. Bweeeeep.");
      if (message.guildId === "747327258854948935") {
        logger.info(
          `We're in the hunting server with the boys. Hell yeah. Booop.`
        );
        reroll_tongues(in_tongues);
        return message.reply(in_tongues);
      } else {
        reroll(speak);
        logger.info(
          `Sending a funny quip to guild: [${message.guild.name}] beeeeep.`
        );
        return message.reply(speak);
      }
    }
    return;
  }
  if (message.content.includes("<@&")) {
    let roleID = message.content.split("<@&")[1].split(">")[0];
    const botGuildObject = message.guild.members._cache.get(
      message.client.user.id
    );
    if (botGuildObject.roles.cache.has(roleID)) {
      if (message.guildId === "747327258854948935") {
        logger.info(
          `We're in the hunting server with the boys. Hell yeah. Beep.`
        );
        reroll_tongues(in_tongues);
        return message.reply(in_tongues);
      } else {
        reroll(speak);
        logger.info(
          `Sending a funny quip to server: [${message.guild.name}] Bweep.`
        );
        return message.reply(speak);
      }
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
    `I am a music bot by Dennis and Will. Possible commands are "!play", "!skip", and "!stop". Type "!help" followed by a command for more info about that command.   
    Example: "!help play"`
    );
  }
};

module.exports = { handleAt, handleHelp, trimAt, activate };
