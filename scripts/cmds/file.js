const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "file",
    author: "Limon",
    description: "Send the command's source code as text or file",
    category: "utility",
    usage: "file <command_name>",
    usePrefix: true,
    role: 2,
  },

  onStart: async ({ args, message }) => {
    if (!args[0]) {
      return message.reply("⚠️ Usage: !file <command_name>");
    }

    const commandName = args[0].trim();
    const filePath = path.join(__dirname, `${commandName}.js`);

    if (!fs.existsSync(filePath)) {
      return message.reply(`❌ Command "${commandName}" not found in command folder.`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Option 1: Send as code block
    await message.code(fileContent);

    // Option 2 (optional): Send as file attachment
    /*
    await message.send({
      body: `📄 Source code for "${commandName}.js"`,
      attachment: fs.createReadStream(filePath),
    });
    */
  }
};
