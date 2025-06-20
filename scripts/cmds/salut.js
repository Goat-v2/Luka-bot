module.exports = {
  config: {
    name: "salut",
    version: "1.0",
    author: "Luka",
    countDown: 0,
    role: 0,
    shortDescription: "Répond avec une salutation personnalisée",
    longDescription: "Répond avec un message de salutation qui inclut le nom de l'utilisateur lorsque quelqu'un écrit 'salut'.",
    category: "FUN",
  },
  onStart: async function() {},
  onChat: async function({ event, message, api }) {
    try {
      if (event.body && event.body.toLowerCase() === "salut") {
        const senderID = event.senderID;
        const senderInfo = await api.getUserInfo(senderID);
        const senderName = senderInfo[senderID]?.name || 'utilisateur';     
        const responses = [
          `Salut ${senderName} ! Comment puis-je t'aider aujourd'hui ?`,
          `Bonjour ${senderName} ! Que puis-je faire pour toi ? 😇`,
          `Hey ${senderName} ! Comment ça va ? 🪶`,
          `Salut ${senderName}, quel est le programme aujourd'hui ? 🤡`,
          `Salut ${senderName}, tout va bien ?🏀`
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await message.reply(randomResponse);
        
        await api.setMessageReaction("🙀", event.messageID, () => {}, true);
      }
    } catch (error) {
      console.error("Erreur lors du traitement du message :", error);
    }
  }
};
