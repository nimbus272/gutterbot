const {
  handlePlay,
  handleSkip,
  handleStop,
  handleKill,
} = require(`${__dirname}/../util/musicCommands.js`);

const { handleAt } = require(`${__dirname}/../util/funCommands.js`);

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) {
      return;
    }
    if (message.content.startsWith("<@")) {
      await handleAt(message);
    }
    if (!message.content.startsWith(process.env.PREFIX)) {
      return;
    }

    if (message.content.toLowerCase().startsWith(`${process.env.PREFIX}play`)) {
      await handlePlay(message);
    } else if (
      message.content.toLowerCase().startsWith(`${process.env.PREFIX}skip`)
    ) {
      await handleSkip(message);
    } else if (
      message.content.toLowerCase().startsWith(`${process.env.PREFIX}stop`)
    ) {
      await handleStop(message);
    } else if (
      message.content.toLowerCase().startsWith(`${process.env.PREFIX}kill`)
    ) {
      await handleKill(message);
    } else {
      return message.reply("bro you suck :slugma:");
    }
  },
};
