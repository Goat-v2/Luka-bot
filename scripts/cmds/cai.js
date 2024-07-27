const axios = require("axios");

const models = [
  "gpt-4",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-0314",
  "gpt-4-32k-0314",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k-0613",
  "gpt-3.5-turbo-0301",
  "text-davinci-003",
  "text-davinci-002",
  "code-davinci-002",
  "gpt-3",
  "text-curie-001",
  "text-babbage-001",
  "text-ada-001",
  "davinci",
  "babbage",
  "curie",
  "ada",
  "babbage-002",
  "davinci-002"
];

module.exports["config"] = {
  name: "cai",
  aliases: ["caibot"],
  version: "0.0.1",
  credits: "atomic-zero",
  role: 0,
  type: "artificial-intelligence",
  info: "chat with prompt",
  usage: "[prompt]",
  guide: "cai write me a story",
  cd: 6
};

module.exports["run"] = async ({ api, args, event }) => {
  const { threadID, senderID } = event;
  const text = args.join(" ");

  const chat = {
    reply: txt => api.sendMessage(txt, threadID)
  };

  if (!text) {
    chat.reply("Please provide a question!");
    return;
  }

  const isReset = ["forget", "reset", "clear", "forgot"].includes(text.toLowerCase());

  if (!isReset) {
    chat.reply("Answering your question");
  }

  const requests = models.map(model =>
    axios.post("https://atomic-zero.vercel.app/chat-request", {
      model,
      chatID: senderID,
      prompt: isReset ? "" : text,
      reset: isReset
    }).catch(error => null)
  );

  try {
    const responses = await Promise.all(requests);
    const validResponse = responses.find(response => response && response.data);

    if (validResponse) {
      const { answer, message, audio } = validResponse.data;

      if (isReset) {
        chat.reply(message);
      } else {
        chat.reply(answer);
      }

      if (audio) {
        try {
          const audioResponse = await axios.get(audio, {
            responseType: "stream"
          });
          await chat.reply({
            body: "💽 Voice Message",
            attachment: audioResponse.data
          });
        } catch (audioError) {
          console.error("Error fetching audio:", audioError);
        }
      }
    } else {
      chat.reply("No response. Try again later.");
    }
  } catch (error) {
    console.error("Error processing requests:", error);
    chat.reply("No response. Try again later.");
  }
}
