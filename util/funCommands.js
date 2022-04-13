const logger = require("winston");
const talk = require(`${__dirname}/../util/thingsForRobotsToSay.json`);

async function reroll(speak) {
  
  if (speak === talk.phrases[7]) {
    speak = talk.phrases[Math.floor(Math.random() * talk.phrases.length)];
  }
  return speak;
}

async function reroll_tongues(in_tongues) {
  if (in_tongues === talk.huntin_phrases[7]) {
    in_tongues =
      talk.huntin_phrases[Math.floor(Math.random() * talk.huntin_phrases.length)];
  }
  return in_tongues;
}

//  if (message.guildId === "747327258854948935")

const handleAt = async (message) => {
  let in_tongues = talk.huntin_phrases[Math.floor(Math.random() * talk.huntin_phrases.length)];
  let speak = talk.phrases[Math.floor(Math.random() * talk.phrases.length)];
  if (message.content.includes("<@961706313375703050")) {
    if (message.guildId === "747327258854948935") {
      reroll_tongues(in_tongues);
      return message.reply(in_tongues);
    } else {
      reroll(speak);
      return message.reply(speak);
    }
  }
  if (message.content.includes("<@&")) {
    let roleID = message.content.split("<@&")[1].split(">")[0];
    const botGuildObject = message.guild.members._cache.get(
      message.client.user.id
    );
    if (botGuildObject.roles.cache.has(roleID)) {
      logger.info(message.guildId)
      if (message.guildId === "747327258854948935") {
        reroll_tongues(in_tongues);
        return message.reply(in_tongues);
      } else {
        reroll(speak);
        return message.reply(speak);
      }
    }
  }
};

const handleHelp = async (message) => {

  if (message.content.toLowerCase().startsWith(`${process.env.PREFIX}help play`)) {
    return message.reply(`The !play command is used to add videos to the queue. You can either provide a URL or a search term. If you provide a search term, the first video in the search results will be added to the queue. Example: "!play never gonna give you up"`);
  }
  if (message.content.toLowerCase().startsWith(`${process.env.PREFIX}help skip`)) {
    return message.reply(`The !skip command is used to skip the currently playing video. If there is another video in the queue, it will play next. Example: "!skip"`);
  }
  if (message.content.toLowerCase().startsWith(`${process.env.PREFIX}help stop`)) {
    return message.reply(`The !stop command is used to stop the currently playing video and empty the queue. Example: "!stop"`);
  }
      if (message.content.toLowerCase().startsWith(`${process.env.PREFIX}help`)) {
    return message.reply(`I am a music bot by <@133810029743570944> and <@334150403015049216>. Possible commands are "!play", "!skip", and "!stop". Type "!help" followed by a command for more info about that command.`);
  }
};

module.exports = { handleAt, handleHelp };
