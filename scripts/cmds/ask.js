const axios = require('axios');

const fonts = {
  mathsans: {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
    j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
    J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
    S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
  }
};

const Prefixes = [
  'ai',
];

module.exports = {
  config: {
    name: "ai",
    version: "1",
    author: "aesther",
    longDescription: "Command with no prefix\n💬 - LLaMA, a large language model developed by Meta AI that can understand and respond to human input in a conversational manner. I'm a type of artificial intelligence designed to generate human-like text responses.",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {
    // Initialization logic here if needed
  },
  onChat: async function ({ api, event, args, message }) {
    try {
      // Check if the message starts with a valid prefix
      const prefix = Prefixes.find((p) => event.body && event.body.trim().toLowerCase().startsWith(p.toLowerCase()));
      if (!prefix) {
        return; // Ignore the command if prefix is not recognized
      }

      // Extract the question from the message
      const prompt = event.body.substring(prefix.length).trim();
      const senderID = event.senderID;
      const senderInfo = await api.getUserInfo(senderID); // Use senderID directly
      const senderName = senderInfo[senderID].name;
      const genderText = senderInfo[senderID]?.gender === 1 ? "♀" : senderInfo[senderID]?.gender === 2 ? "♂" : "🏳‍🌈 LGBT";

      if (!prompt) {
        await message.reply(` 🎉 𝐋𝐔𝐊𝐀 𝐁𝐎𝐓 🎉\n\nHello ${senderName} ⁉`);
        api.setMessageReaction("⁉", event.messageID, () => {}, true);
        return;
      }

      // Make a GET request to the AI API
      const response = await axios.get(`https://c-v1.onrender.com/chat/coral`, {
        params: { prompt: prompt }
      });
      const answer = response.data.response;

      // Apply font transformation to each letter in the answer
      let formattedAnswer = "";
      for (let letter of answer) {
        formattedAnswer += fonts.mathsans[letter] || letter;
      }

      await message.reply(` ✰ 𝐋𝐔𝐊𝐀 𝐁𝐎𝐓 ✰\n\n${formattedAnswer}\n\n[${genderText}] ${senderName}`);
      api.setMessageReaction("💬", event.messageID, () => {}, true);

    } catch (error) {
      console.error("Error:", error.message);
      await message.reply("Sorry, I couldn't process your question at the moment.");
    }
  }
};
