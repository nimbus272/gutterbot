module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    if (oldMessage.author.bot || newMessage.author.bot) {
      return;
    }

    let edit = {
      author: newMessage.author,
      message: oldMessage,
    };

    newMessage.client.editMap.set(newMessage.guild.id, edit);
  },
};
