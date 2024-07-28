const axios = require("axios");



module.exports = {

  config: {

    name: "goatmart",

    aliases: ["gm"],

    shortDescription: {

      en: "View items available in the 𝗚𝗼𝗮𝘁𝗠𝗮𝗿𝘁"

    },

    category: "goatstore",

    usage: "✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰\n👑 Available Choices:\n-> ${event.body} page < page number >\n-> ${event.body} code < item ID >\n-> ${event.body} author < name >\n-> ${event.body} show < item ID >\n-> ${event.body} search < item name >\n-> ${event.body} edit < item ID >\n-> ${event.body} upload < item details in JSON format >",

    version: "10.5",

    role: 0,

    author: "ArYAN",

  },

  onStart: async ({ api, event, args, message }) => {

    const serverURL = "https://goat-mart-api.onrender.com";



    try {

      if (!args[0]) {

        api.sendMessage(`✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\n👑 Available Choices:\n-> ${event.body} page < page number >\n-> ${event.body} author < name >\n-> ${event.body} code < item ID >\n-> ${event.body} show < item ID >\n-> ${event.body} search < item name >\n-> ${event.body} edit < item ID >\n-> ${event.body} upload < item details in JSON format >`, event.threadID, event.messageID);

      } else if (args[0] === "code") {

        const itemID = isNaN(args[1]) ? args[1] : parseInt(args[1]);

        const response = await axios.get(`${serverURL}/api/items/${itemID}`);

        const codeX = await axios.get(response.data.pastebinLink);

        const codeExtracted = codeX.data;



        if (codeExtracted) {

          message.reply(`✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\n👑 𝗜𝘁𝗲𝗺 𝗡𝗮𝗺𝗲: ${response.data.itemName}\n🆔 𝗜𝘁𝗲𝗺 𝗜𝗗: ${response.data.itemID}\n⚙ 𝗜𝘁𝗲𝗺 𝗧𝘆𝗽𝗲: ${response.data.type || 'Unknown' }\n💻 𝗔𝘂𝘁𝗵𝗼𝗿: ${response.data.authorName}\n📅 𝗔𝗱𝗱𝗲𝗱 𝗼𝗻: ${new Date(response.data.timestamp).toLocaleString()}\n✅ 𝗜𝘁𝗲𝗺 𝗖𝗼𝗱𝗲\n━━━━━━━━━━━━━━━\n${codeExtracted }`);

        } else {

          api.sendMessage("✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\nItem not found.", event.threadID, event.messageID);

        }

      } else if (args[0] === "author") {

        const authorName = args[1];

        const response = await axios.get(`${serverURL}/api/items/author/${authorName}`);

        const authorItems = response.data;



        if (authorItems.length > 0) {

          const itemDescriptions = authorItems.map(

            (item) =>

              `\n👑 𝐈𝐭𝐞𝐦 𝐧𝐚𝐦𝐞: ${item.itemName}

🆔 𝗜𝘁𝗲𝗺 𝗜𝗗 : ${item.itemID}

⚙ 𝗜𝘁𝗲𝗺 𝗧𝘆𝗽𝗲: ${item.type || "Unknown"}

📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${item.description}

📅 𝗔𝗱𝗱𝗲𝗱 𝗢𝗻: ${new Date(item.timestamp).toLocaleString()}\n\n━━━━━━━━━━━━━━━

`

          );

          const itemInfo = itemDescriptions.join("\n");



          message.reply(`✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\n\n𝗜𝘁𝗲𝗺𝘀 𝗕𝘆: ${authorName}\n\n${itemInfo}`);

        } else {

          api.sendMessage(`✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\n\nNo items found for this author.`, message.threadID);

        }

      } else if (args[0] === "page") {

        const pageNumber = parseInt(args[1]);

        const response = await axios.get(`${serverURL}/api/items`);

        const items = response.data;

        const totalPages = Math.ceil(items.length / 9);

        const offset = (pageNumber - 1) * 9;



        if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {

          api.sendMessage("✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\nInvalid page number.", event.threadID, event.messageID);

        } else {

          const pageItems = items.slice(offset, offset + 9);



          const itemDescriptions = pageItems.map(

            (item) =>

              `👑 𝗜𝘁𝗲𝗺 𝗡𝗮𝗺𝗲: ${item.itemName}\n🆔 𝗜𝘁𝗲𝗺 𝗜𝗗: ${item.itemID}\n⚙ 𝗜𝘁𝗲𝗺 𝗧𝘆𝗽𝗲: ${item.type || "Unknown"}\n📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${item.description}\n💻 𝗔𝘂𝘁𝗵𝗼𝗿: ${item.authorName}\n📅 𝗔𝗱𝗱𝗲𝗱 𝗢𝗻: ${new Date(item.timestamp).toLocaleString()}\n\n━━━━━━━━━━━━━━━\n`

          );



          const itemInfo = itemDescriptions.join("\n");



          message.reply(`✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰\nItems available in the 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭:\n\n${itemInfo}📝 𝗨𝘀𝗲 ${event.body.split(" ")[0]} [ show | code ] <item id> to view pastebin link or code.\n\n👑 𝗣𝗮𝗴𝗲𝘀: [ ${pageNumber} / ${totalPages} ]`);

        }

      } else if (args[0] === "show") {

        const itemID = isNaN(args[1]) ? args[1] : parseInt(args[1]); 

        const response = await axios.get(`${serverURL}/api/items/${itemID}`);

        const item = response.data;



        if (item && itemID) {

          message.reply(`✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\n👑 𝗜𝘁𝗲𝗺 𝗡𝗮𝗺𝗲: ${item.itemName}\n🆔 𝗜𝘁𝗲𝗺 𝗜𝗗: ${item.itemID}\n📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${item.description}\n🖇 𝗜𝘁𝗲𝗺 𝗟𝗶𝗻𝗸: ${item.pastebinLink}`);

        } else {

          api.sendMessage("✰ 𝐆𝐨𝐚𝐫𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\nItem not found.", event.threadID, event.messageID);

        }

      } else if (args[0] === "search") {

        const searchTerm = args.slice(1).join(" ").toLowerCase();

        const response = await axios.get(`${serverURL}/api/items`);

        const items = response.data;

        const matchingItems = items.filter(item => item.itemName.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm));



        if (matchingItems.length > 0) {

          const itemDescriptions = matchingItems.map(item => `\n👑 𝗜𝘁𝗲𝗺 𝗡𝗮𝗺𝗲: ${item.itemName}\n🆔 𝗜𝘁𝗲𝗺 𝗜𝗗: ${item.itemID}\n⚙ 𝗜𝘁𝗲𝗺 𝗧𝘆𝗽𝗲: ${item.type || "Unknown"}\n📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${item.description}\n💻 𝗔𝘂𝘁𝗵𝗼𝗿: ${item.authorName}\n📅 𝗔𝗱𝗱𝗲𝗱 𝗢𝗻: ${new Date(item.timestamp).toLocaleString()}\n━━━━━━━━━━━━━━━\n`);

          const itemInfo = itemDescriptions.join("\n");



          message.reply(`✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\n\n✅ Search Results for ${searchTerm}\n\n${itemInfo}`);

        } else {

          api.sendMessage("✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\n\nNo matching items found in goatmart.", event.threadID, event.messageID);

        }

      } else if (args[0] === "edit") {

        const itemID = isNaN(args[1]) ? args[1] : parseInt(args[1]); 

        const newItemDetails = JSON.parse(args.slice(2).join(" "));

        const response = await axios.put(`${serverURL}/api/items/${itemID}`, newItemDetails);

        message.reply(`✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\n\n✅ Item edited successfully\n👑 𝗜𝘁𝗲𝗺 𝗡𝗮𝗺𝗲: ${response.data.itemName}\n🆔 𝗜𝘁𝗲𝗺 𝗜𝗗: ${response.data.itemID}`);

      } else if (args[0] === "upload") {

        const itemDetails = JSON.parse(args.slice(1).join(" "));

        const response = await axios.post(`${serverURL}/api/items`, itemDetails);

        message.reply(`✰ 𝐆𝐨𝐚𝐭𝐦𝐚𝐫𝐭 ✰\n✰✰✰✰✰✰✰✰✰✰\n\n✅ Item uploaded successfully\n👑 𝗜𝘁𝗲𝗺 𝗡𝗮𝗺𝗲: ${response.data.itemName}\n🆔 𝗜𝘁𝗲𝗺 𝗜𝗗: ${response.data.itemID}\n⚙ 𝗜𝘁𝗲𝗺 𝗧𝘆𝗽𝗲: ${response.data.type || "Unknown"}`);

      }

    } catch (error) {

      console.error("Error fetching items:", error);

      api.sendMessage("❌ Invalid Item ID or JSON format: " + error.message, event.threadID);

    }

  },

}
