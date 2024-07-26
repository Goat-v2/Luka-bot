module.exports = {
  config: {
    name: "sex",
    aliases: ["xxxxx"],
    version: "1.0",
    author: "ʬʆʬ Sønïč Shïsûį ʬɸʬ",
    countDown: 10,
    role: 0,
    shortDescription: "Pornography videos ",
    longDescription: "send you Pornography videos",
    category: "18+",
    guide: "{p}{n}hvdo",
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;

    const loadingMessage = await message.reply({
      body: "🔞 | xvideos.com.",
    });

    const link = ["https://tinyurl.com/2y473tj5",
"https://tinyurl.com/2d9hu58z",
"https://tinyurl.com/2btdbbdc",
"https://tinyurl.com/26ncj27v",
"https://tinyurl.com/2bb65ufm",
"https://tinyurl.com/2angjcb9",
"https://tinyurl.com/25reoce4",
"https://tinyurl.com/27qrule7",
"https://tinyurl.com/2xzdrgce",
"https://tinyurl.com/2dqc54kk",
"https://tinyurl.com/2dlna4zb",
"https://tinyurl.com/225douec",
"https://tinyurl.com/22s8vtr7",];

    const availableVideos = link.filter(video => !this.sentVideos.includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos = [];
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomVideo = availableVideos[randomIndex];

    this.sentVideos.push(randomVideo);

    if (senderID !== null) {
      message.reply({
        body: "❤🔞 Pornography loaded successfully 🔞❤",
        attachment: await global.utils.getStreamFromURL(randomVideo),
      });

      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 5000);
    }
  },
}
