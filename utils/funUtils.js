const path = require("path");
const { logger } = require(path.join(__dirname, "..", "models", "logger"));
const replies = require(`${__dirname}/../resources/thingsForRobotsToSay.json`);

module.exports = {

  trimAt: (message) => {
    if (
      message.content.startsWith(`${process.env.PREFIX}`) &&
      message.content.includes("<@")
    ) {
      let at = message.content.split("<@")[1].split(">")[0];
      message.content = message.content.replace(`<@${at}>`, "");
      logger.info("Successfully trimmed @ from search request.");
    }
  },

  determinePhraseFromGuild: (message) => {
    let phrase;
    if (message.guildId === "747327258854948935") {
      phrase =
        replies.huntinPhrases[
          Math.floor(Math.random() * replies.huntinPhrases.length)
        ];
      if (phrase === replies.huntinPhrases[7]) {
        logger.info(
          "Rerolled anti-riley propaganda. If it gets through now, it was fate."
        );
        phrase =
          replies.phrases[
            Math.floor(Math.random() * replies.huntinPhrases.length)
          ];
      }
    } else {
      phrase =
        replies.phrases[Math.floor(Math.random() * replies.phrases.length)];
      if (phrase === replies.phrases[7]) {
        logger.info(
          "Rerolled anti-riley propaganda. If it gets through now, it was fate."
        );
        phrase =
          replies.phrases[Math.floor(Math.random() * replies.phrases.length)];
      }
    }
    return phrase;
  },
};
