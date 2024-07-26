const axios = require('axios');

module.exports = {
  config: {
    name: 'gpt2',
    version: '1.0',
    countDown: 10,
    role: 0,
    category: 'AI',
    description: '𝗀𝗉𝗍 𝗈𝗋𝗂𝗀𝗂𝗇𝖺𝗅',
    author: 'Hady Zen',
    guide: { en: '{pn} <𝗉𝗋𝗈𝗆𝗉𝗍>' }
  },

  onStart: async function ({ message, args, event, api }) {
    const tanyakan = args.join(' ') || "hai";

    try {
      message.reaction('🩵', event.messageID);
      const hadi = await message.reply('♡ 𝗚𝗣𝗧 •••');
      const gemini = await axios.get(`https://api.prabath-md.tech/api/gptv1?q=${encodeURIComponent(tanyakan)}`);
      const pipi = gemini.data.data;
      api.editMessage(`♡ 𝗚𝗣𝗧\n\n${pipi}`, hadi.messageID);

    } catch (error) {
      message.reply(`𝖤𝗋𝗋𝗈𝗋: ${error}`);
    }
  }
};
