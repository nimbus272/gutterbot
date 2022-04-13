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
      talk.huntin_phrases[
        Math.floor(Math.random() * talk.huntin_phrases.length)
      ];
  }
  return in_tongues;
}

//  if (message.guildId === "747327258854948935")

const handleAt = async (message) => {
  let in_tongues = talk.huntin_phrases[Math.floor(Math.random() * talk.huntin_phrases.length)];
  let speak = talk.phrases[Math.floor(Math.random() * talk.phrases.length)];
  if (message.content.includes("<@963619581346344991")) {
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

module.exports = { handleAt };
