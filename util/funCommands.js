const logger = require("winston");
const talk = require(`${__dirname}/../util/thingsForRobotsToSay.json`);

let speak = talk.phrases[Math.floor(Math.random() * talk.phrases.length)];

const handleAt = async (message) => {
  if (message.content.startsWith("<@961706313375703050")) {
    return message.reply(
      talk.phrases[Math.floor(Math.random() * talk.phrases.length)]
    );
  }
  let roleID = message.content.split("<@&")[1].split(">")[0];
  const botGuildObject = message.guild.members._cache.get(
    message.client.user.id
  );
  if (botGuildObject.roles.cache.has(roleID)) {
      if (speak === talk.phrases[7]) {
          speak = talk.phrases[Math.floor(Math.random() * talk.phrases.length)];
        }
    return message.reply(speak);
  }
};
module.exports = { handleAt };
