const {
  handlePlay,
  handleSkip,
  handleStop,
  handleKill,
  handleInfo,
} = require(`${__dirname}/../helpers/musicCommands.js`);

const {
  handleAt,
  handleHelp,
  handleActivate,
  handleNoCommand,
  handleExpose,
} = require(`${__dirname}/../helpers/funCommands.js`);

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) {
      return;
    }
    if (message.content.includes("<@")) {
      if (message.author.id === "429481922729738280") {
        return;
      }
      await handleAt(message);
    }
    if (!message.content.startsWith(process.env.PREFIX)) {
      return;
    }
    if (message.content.startsWith(`${process.env.PREFIX}activate`)) {
      await handleActivate(message);
      return;
    }
    if (message.content.startsWith(`${process.env.PREFIX}help`)) {
      await handleHelp(message);
      return;
    }
    if (message.content.startsWith(`${process.env.PREFIX}info`)) {
      await handleInfo(message);
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
    } else if (
      message.content.toLowerCase().startsWith(`${process.env.PREFIX}expose`)
    ) {
      handleExpose(message);
    } else {
      handleNoCommand(message);
    }
  },
};
