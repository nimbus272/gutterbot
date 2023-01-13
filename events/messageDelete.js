module.exports = {
    name: "messageDelete",
    async execute(message) {
      if (message.author.bot) {
        return;
      }
  
      let edit = {
        author: message.author,
        message: message,
      };
  
      message.client.editMap.set(message.guild.id, edit);
    },
  };