const axios = require('axios');



module.exports = {

  config: {

    name: "prodia",



    version: "1.1",

    author: "ArYAN",

    countDown: 10,

    role: 0,

    shortDescription: {

      en: 'Text to Image'

    },

    longDescription: {

      en: "Text to image"

    },

    category: "image",

    guide: {

      en: '{pn} your prompt'

    }

  },



  onStart: async function ({ api, event, args, message, usersData }) {

    const text = args.join(" ");

    if (!text) {

      return message.reply("❓| 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐩𝐫𝐨𝐦𝐩𝐭");

    }



    let prompt = text;



    message.reply("✅| Creating your Imagination...", async (err, info) => {

      let ui = info.messageID;

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      try {

        const response = await axios.get(`https://global-sprak.onrender.com/api/prodia?prompt=${encodeURIComponent(prompt)}&amount=4`);

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        const images = response.data.result;

        message.unsend(ui);

        message.reply({

          body: `🖼 𝐩𝐫𝐨𝐝𝐲𝐚 \n✰✰✰✰✰✰✰✰✰✰\n\nPlease reply with the image number (1, 2, 3, 4) to get the corresponding image in high resolution.`,

          attachment: await Promise.all(images.map(img => global.utils.getStreamFromURL(img)))

        }, async (err, info) => {

          if (err) return console.error(err);

          global.GoatBot.onReply.set(info.messageID, {

            commandName: this.config.name,

            messageID: info.messageID,

            author: event.senderID,

            imageUrls: images

          });

        });

      } catch (error) {

        console.error(error);

        api.sendMessage(`Error: ${error}`, event.threadID);

      }

    });

  },



  onReply: async function ({ api, event, Reply, usersData, args, message }) {

    const reply = parseInt(args[0]);

    const { author, imageUrls } = Reply;

    if (event.senderID !== author) return;

    try {

      if (reply >= 1 && reply <= 4) {

        const img = imageUrls[reply - 1];

        message.reply({ attachment: await global.utils.getStreamFromURL(img) });

      } else {

        message.reply("Invalid image number. Please reply with a number between 1 and 4.");

        return;

      }

    } catch (error) {

      console.error(error);

      api.sendMessage(`Error: ${error}`, event.threadID);

    }

    message.unsend(Reply.messageID); 

  },

}
