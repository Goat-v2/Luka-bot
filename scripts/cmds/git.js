const axios = require('axios');
module.exports = {
  config: {
    name: 'git',
    version: '0.1.0',
    author: 'Priyanshi Kaur',
    role: 2,
    description: {
      en: 'Simple Database Using GitHub Repository ',
    },
    category: 'owner',
    guide: {
      en: ' {pn} save <filename> <content>: Save code to your GitHub repository\n {pn} search <search_term>: Search for code in your GitHub repository',
    },
  },

  onLoad: async ({ senderID, message }) => {
    const allowedID = "YOUR_ALLOWED_ID"; // Replace with the actual ID
    if (senderID !== allowedID) {
      message.reply("You are not allowed");
    }
  },

  onStart: async ({ args, message, event }) => {
    const owner = 'XXXXX'; // Your GitHub username
    const repo = 'XXXXX'; // Your GitHub repository name
    const token = 'XXXXXX'; // Your GitHub access token

    if (args[0] === 'save') {
      if (args.length < 3) {
        return message.reply('⚠ Please provide both filename and content.');
      }

      const fileName = args[1];
      const content = args.slice(2).join(' ');

      try {
        const response = await axios.put(
          `https://api.github.com/repos/${owner}/${repo}/contents/scripts/cmds/${fileName}`,
          {
            message: `Saving ${fileName}`,
            content: Buffer.from(content).toString('base64'),
            sha: '', // Get the SHA of the file if it exists (optional)
            branch: 'main', // Or your desired branch
          },
          {
            headers: {
              Authorization: `token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          message.reply(`✅ Saved "${fileName}" to your repository.`);
        } else {
          message.reply(`❌ Failed to save "${fileName}".`);
        }
      } catch (error) {
        console.error(error);
        message.reply('❌ An error occurred while saving the file.');
      }
    } else if (args[0] === 'search') {
      if (args.length < 2) {
        return message.reply('⚠ Please provide a search term.');
      }

      const searchTerm = args.slice(1).join();

      try {
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/scripts/cmds`,
          {
            headers: {
              Authorization: `token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          const files = response.data;
          const matchingFiles = files.filter(file => file.name.includes(searchTerm));

          if (matchingFiles.length === 0) {
            message.reply('No results found for your search.');
          } else {
            let searchResults = 'Search Results:\n\n';
            matchingFiles.forEach((file, index) => {
              searchResults += `${index + 1}. **${file.name}**\n`;
              searchResults += ` - ${file.path}\n`;
              searchResults += ` - ${file.html_url}\n\n`;
            });
            message.reply(searchResults);

            // Prompt user for file selection if multiple results
            if (matchingFiles.length > 1) {
              message.reply('.');

              // Wait for the user's reply
              message.onReply((reply) => {
                const fileIndex = parseInt(reply.body) - 1;

                if (fileIndex >= 0 && fileIndex < matchingFiles.length) {
                  const selectedFile = matchingFiles[fileIndex];
                  message.reply(`File: ${selectedFile.name}\nPath: ${selectedFile.path}\nURL: ${selectedFile.html_url}`);
                } else {
                  message.reply('Invalid file number.');
                }
              });
            }
          }
        } else {
          message.reply('❌ Failed to search your repository.');
        }
      } catch (error) {
        console.error(error);
        message.reply('❌ An error occurred while searching the repository.');
      }
    } else {
      message.reply('Invalid command. Use "save" or "search".');
    }
  },
};
