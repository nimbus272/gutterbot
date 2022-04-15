const {
  handlePlay,
  handleSkip,
  handleStop,
  handleKill,
} = require(`${__dirname}/../util/musicCommands.js`);

const {
  handleAt,
  handleHelp,
  trimAt,
  activate,
} = require(`${__dirname}/../util/funCommands.js`);

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) {
      return;
    }
    if (
      message.content.startsWith(`${process.env.PREFIX}`) &&
      message.content.includes("<@")
    ) {
      await handleAt(message);
      await trimAt(message);
    }
    if (
      message.content.includes("<@") &&
      !message.content.startsWith(`${process.env.PREFIX}`)
    ) {
      await handleAt(message);
    }
    if (!message.content.startsWith(process.env.PREFIX)) {
      return;
    }
    if (message.content.startsWith(`${process.env.PREFIX}activate`)) {
      await activate(message);
      return;
    }
    if (message.content.startsWith(`${process.env.PREFIX}help`)) {
      await handleHelp(message);
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
      if (message.guildId === "747327258854948935") {
        return message.reply("bro you suck <:slugma:852187551766806578>");
      } else {
        return message.reply("bro you suck <:slugma:963669188914864169>");
      }
    }
  },
};
