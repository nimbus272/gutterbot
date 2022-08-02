module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    if (oldMessage.author.bot || newMessage.author.bot) {
      return;
    }

    newMessage.client.editMap.set(newMessage.guild.id, oldMessage);
  },
};
