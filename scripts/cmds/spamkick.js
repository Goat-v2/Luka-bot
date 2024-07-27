let messageCounts = {};
const spamThreshold = 5;
const spamInterval = 60 * 1000; // 60 secondes
const adminID = "61553923074004"; // Remplacer par l'ID de l'admin
const warningThreshold = 3;
const tempBanDuration = 10 * 60 * 1000; // 10 minutes
const whiteListedUsers = ["61553923074004","61562153754689"];
const logs = [];

// Fonction de nettoyage des messages anciens
function cleanOldMessages() {
  const now = Date.now();
  for (const threadID in messageCounts) {
    for (const senderID in messageCounts[threadID]) {
      const user = messageCounts[threadID][senderID];
      if (now - user.timestamp > spamInterval) {
        clearTimeout(user.timer);
        delete messageCounts[threadID][senderID];
      }
    }
  }
}

setInterval(cleanOldMessages, spamInterval);

module.exports = {
  config: {
    name: "spamkick",
    aliases: [],
    version: "2.0",
    author: "元 Aldéric-シ︎︎",
    countDown: 5,
    role: 0,
    shortDescription: "Détection automatique et action contre le spam",
    longDescription: "Détection automatique et action contre le spam",
    category: "admin",
    guide: "{pn}",
  },

  onStart: async function ({ api, event, args }) {
    api.sendMessage("Cette commande détecte automatiquement et agit contre le spam dans les discussions de groupe", event.threadID, event.messageID);
  },

  onChat: function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;

    if (whiteListedUsers.includes(senderID)) return;

    if (!messageCounts[threadID]) {
      messageCounts[threadID] = {};
    }

    if (!messageCounts[threadID][senderID]) {
      messageCounts[threadID][senderID] = {
        count: 1,
        warnings: 0,
        timestamp: Date.now(),
        timer: setTimeout(() => {
          delete messageCounts[threadID][senderID];
        }, spamInterval),
      };
    } else {
      const user = messageCounts[threadID][senderID];
      user.count++;
      user.timestamp = Date.now();

      if (user.count > warningThreshold && user.count <= spamThreshold) {
        api.sendMessage("⚠️ 𝐀𝐯𝐞𝐫𝐭𝐢𝐬𝐬𝐞𝐦𝐞𝐧𝐭: 𝐯𝐨𝐮𝐬 𝐞̂𝐭𝐞 𝐬𝐮𝐬𝐩𝐞𝐜𝐭𝐞́ 𝐝𝐞 𝐬𝐩𝐚𝐦 𝐯𝐞𝐢𝐥𝐥𝐞𝐳 𝐚𝐫𝐫𝐞̂𝐭𝐞́ .", threadID, messageID);
        user.warnings++;
      }
      if (user.count > spamThreshold) {
        api.sendMessage("🚨🛡| Spam détecté.", threadID, messageID);
        api.removeUserFromGroup(senderID, threadID);
        logs.push({
          userID: senderID,
          threadID: threadID,
          timestamp: new Date().toISOString(),
          message: body
        });
        api.sendMessage(`Utilisateur ${senderID} a été retiré pour spam dans le groupe ${threadID}.`, adminID);
        clearTimeout(user.timer);
        user.timer = setTimeout(() => {
          api.addUserToGroup(senderID, threadID);
          delete messageCounts[threadID][senderID];
        }, tempBanDuration);
      }
    }
  },

  showLogs: function({ api, event }) {
    const logMessages = logs.map(log => `Utilisateur: ${log.userID}, Groupe: ${log.threadID}, Date: ${log.timestamp}, Message: ${log.message}`).join("\n");
    api.sendMessage(logMessages || "Aucun log de spam détecté.", event.threadID);
  },

  setParams: function({ api, event, args }) {
    const [param, value] = args;
    if (param === "spamThreshold") spamThreshold = parseInt(value);
    if (param === "spamInterval") spamInterval = parseInt(value) * 1000;
    api.sendMessage(`Paramètre ${param} mis à jour à ${value}.`, event.threadID);
  }
};
