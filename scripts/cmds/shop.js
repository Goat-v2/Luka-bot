const items = [
  { id: '1', name: 'Item 1', price: 100, quantity: 10, createdBy: 'system' },
  { id: '2', name: 'Item 2', price: 200, quantity: 20, createdBy: 'system' },
  { id: '3', name: 'Item 3', price: 300, quantity: 30, createdBy: 'system' },
  // Add more items as needed
];

const pendingSales = {}; // To store pending sales by user ID
const userStats = {}; // To track user purchases and sales

module.exports = {
  config: {
    name: "shop",
    aliases: [],
    version: "1.5",
    author: "itz Aryan",
    countDown: 2,
    role: 0,
    longDescription: {
      en: "Your Virtual Shop"
    },
    category: "shop",
    guide: {
      en: "{pn} <command> [options]"
    },
    envConfig: {
      reward: 10000 // Default reward for correct answers
    }
  },
  langs: {
    en: {
      reply: "⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nPlease provide a valid command and options.\n\nAvailable commands:\n\n- `view <item_id>`: View item details\n- `buy <item_id> <price>`: Buy an item\n- `sell <item_id> <price>`: Sell an item\n- `createitem <name> <price>`: Create a new item\n- `promote <item_id> <discount>`: Apply discount to an item\n- `pending`: View pending sales\n- `topusers`: View top users\n- `list`: List all available items\n- `rank`: View your rank and statistics",
      itemNotFound: "⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nItem with ID ${itemId} not found.",
      purchaseError: "⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nThe price provided does not match the item's price. Item price: ${itemPrice}$",
      userNotFound: "⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nUser with ID ${userId} not found.",
      purchaseSuccess: "⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\n🎉 You have successfully purchased ${itemName} for ${price}$.\n\nYour remaining balance: ${remainingBalance}$.",
      saleSuccess: "⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\n🎉 You have successfully sold ${itemName}.\n\nYour new balance: ${newBalance}$.\n\nYour sale is pending approval.",
      itemAdded: "⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\n🆕 New item added: ${name} with ID ${id}.",
      promotionApplied: "⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\n🎉 Promotion applied: ${itemName} is now ${newPrice}$ with ${discount}% discount.",
      pendingSales: "⚙ 𝗉𝖾𝗇𝖽𝗂𝗇𝗀 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nPending Sales:\n${sales}",
      topUsers: "⚙ 𝗍𝗈𝗉 𝗎𝗌𝖾𝗋𝗌 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nTop Users:\n${users}",
      listItems: "⚙ 𝗅𝗂𝗌𝗍 𝗂𝗍𝖾𝗆𝗌 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nAvailable Items:\n${items}",
      invalidCommand: "⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nPlease provide a valid command and options.\n\nAvailable commands:\n\n- `view <item_id>`: View item details\n- `buy <item_id> <price>`: Buy an item\n- `sell <item_id> <price>`: Sell an item\n- `createitem <name> <price>`: Create a new item\n- `promote <item_id> <discount>`: Apply discount to an item\n- `pending`: View pending sales\n- `topusers`: View top users\n- `list`: List all available items\n- `rank`: View your rank and statistics",
      rankInfo: "⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nRank: ${rank}\nName: ${name}\nBought Items: ${boughtItems}\nSold Items: ${soldItems}\nCurrent Balance: ${balance}$"
    }
  },
  onStart: async function ({ message, event, commandName, getLang, args, api, usersData }) {
    const command = args[0]?.toLowerCase();
    const options = args.slice(1);

    try {
      switch (command) {
        case 'view':
          handleViewItem(message, options, getLang);
          break;
        case 'buy':
          handleBuyItem(message, options, event.senderID, usersData, getLang);
          break;
        case 'sell':
          handleSellItem(message, options, event.senderID, usersData, getLang);
          break;
        case 'createitem':
          handleCreateItem(message, options, event.senderID, getLang);
          break;
        case 'promote':
          handlePromotion(message, options, getLang);
          break;
        case 'pending':
          handlePendingSales(message, event.senderID, getLang);
          break;
        case 'topusers':
          handleTopUsers(message, usersData, getLang);
          break;
        case 'list':
          handleListItems(message, getLang);
          break;
        case 'rank':
          handleRank(message, event.senderID, getLang);
          break;
        default:
          message.reply(getLang('invalidCommand'));
      }
    } catch (error) {
      console.error('Error executing command:', error);
      message.reply(`⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nSorry, there was an error processing your request. Please try again later.`);
    }
  }
};

function handleViewItem(message, options, getLang) {
  const [itemId] = options;
  const item = items.find(i => i.id === itemId);

  if (!item) {
    return message.reply(getLang('itemNotFound').replace('${itemId}', itemId));
  }

  message.reply(`⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nItem ID: ${itemId}\nName: ${item.name}\nPrice: ${item.price}$\nCreated By: ${item.createdBy}`);
}

async function handleBuyItem(message, options, userId, usersData, getLang) {
  const [itemId, priceStr] = options;
  const price = parseFloat(priceStr);
  const user = await usersData.get(userId);

  const item = items.find(i => i.id === itemId);

  if (!item) {
    return message.reply(getLang('itemNotFound').replace('${itemId}', itemId));
  }

  if (price !== item.price) {
    return message.reply(getLang('purchaseError').replace('${itemPrice}', item.price));
  }

  if (user.money < price) {
    return message.reply(`⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nYou do not have enough money to purchase ${item.name}. Your balance: ${user.money}$`);
  }

  // Deduct user money
  user.money -= price;

  // Track user purchases
  if (!userStats[userId]) {
    userStats[userId] = { boughtItems: 0, soldItems: 0, money: 0 };
  }
  userStats[userId].boughtItems += 1;
  userStats[userId].money = user.money;

  await usersData.set(userId, user);

  message.reply(getLang('purchaseSuccess')
    .replace('${itemName}', item.name)
    .replace('${price}', price.toFixed(2))
    .replace('${remainingBalance}', user.money.toFixed(2))
  );
}

async function handleSellItem(message, options, userId, usersData, getLang) {
  const [itemId, priceStr] = options;
  const price = parseFloat(priceStr);
  const user = await usersData.get(userId);

  const item = items.find(i => i.id === itemId);

  if (!item) {
    return message.reply(getLang('itemNotFound').replace('${itemId}', itemId));
  }

  if (price !== item.price) {
    return message.reply(`⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nThe price provided does not match the item's price. Item price: ${item.price}$`);
  }

  // Track user sales
  if (!userStats[userId]) {
    userStats[userId] = { boughtItems: 0, soldItems: 0, money: 0 };
  }
  userStats[userId].soldItems += 1;
  userStats[userId].money += price;

  // Add to pending sales
  if (!pendingSales[userId]) {
    pendingSales[userId] = [];
  }
  pendingSales[userId].push({ itemId, price });

  await usersData.set(userId, user);

  message.reply(getLang('saleSuccess')
    .replace('${itemName}', item.name)
    .replace('${newBalance}', userStats[userId].money.toFixed(2))
  );
}

function handleCreateItem(message, options, userId, getLang) {
  const [name, priceStr] = options;
  const price = parseFloat(priceStr);

  const newItemId = (items.length + 1).toString(); // Auto-increment ID
  const newItem = {
    id: newItemId,
    name: name,
    price: price,
    quantity: 1, // Default quantity
    createdBy: userId
  };

  items.push(newItem);

  message.reply(getLang('itemAdded')
    .replace('${name}', name)
    .replace('${id}', newItemId)
  );
}

function handlePromotion(message, options, getLang) {
  const [itemId, discountStr] = options;
  const discount = parseFloat(discountStr);

  const item = items.find(i => i.id === itemId);

  if (!item) {
    return message.reply(getLang('itemNotFound').replace('${itemId}', itemId));
  }

  const newPrice = item.price * (1 - discount / 100);

  item.price = newPrice;

  message.reply(getLang('promotionApplied')
    .replace('${itemName}', item.name)
    .replace('${newPrice}', newPrice.toFixed(2))
    .replace('${discount}', discount.toFixed(2))
  );
}

function handlePendingSales(message, userId, getLang) {
  const sales = pendingSales[userId] || [];
  if (sales.length === 0) {
    return message.reply("⚙ 𝗌𝗁𝗈𝗉 ( 𝖻𝖾𝗍𝖺 )\n━━━━━━━━━━━━━\n\nYou have no pending sales.");
  }

  const salesList = sales.map(sale => `Item ID: ${sale.itemId}, Price: ${sale.price}$`).join('\n');
  message.reply(getLang('pendingSales').replace('${sales}', salesList));
}

function handleTopUsers(message, usersData, getLang) {
  const users = Object.keys(usersData).map(userId => {
    const user = usersData[userId];
    const stats = userStats[userId] || { boughtItems: 0, soldItems: 0, money: 0 };
    return {
      id: userId,
      name: user.name,
      boughtItems: stats.boughtItems,
      soldItems: stats.soldItems,
      money: stats.money
    };
  });

  users.sort((a, b) => b.money - a.money); // Sort by money

  const topUsersList = users.map((user, index) => 
    `Rank: ${index + 1}\nName: ${user.name}\nUID: ${user.id}\nBought Items: ${user.boughtItems}\nSold Items: ${user.soldItems}\nMoney: ${user.money}$`
  ).join('\n\n');

  message.reply(getLang('topUsers').replace('${users}', topUsersList));
}

function handleListItems(message, getLang) {
  const itemsList = items.map(item => 
    `ID: ${item.id}\nName: ${item.name}\nPrice: ${item.price}$\nCreated By: ${item.createdBy}`
  ).join('\n\n');

  message.reply(getLang('listItems').replace('${items}', itemsList));
}

async function handleRank(message, userId, getLang) {
  const user = await usersData.get(userId);
  const stats = userStats[userId] || { boughtItems: 0, soldItems: 0, money: 0 };

  message.reply(getLang('rankInfo')
    .replace('${rank}', user.rank || 'Unranked')
    .replace('${name}', user.name || 'Unknown')
    .replace('${boughtItems}', stats.boughtItems)
    .replace('${soldItems}', stats.soldItems)
    .replace('${balance}', stats.money.toFixed(2))
  );
}
