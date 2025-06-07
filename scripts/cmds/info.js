const moment = require('moment-timezone');
const os = require('os');

module.exports = {
  config: {
    name: "info",
    version: "2.1",
    countDown: 20,
    role: 0,
    author: "Limon",
    description: "Shows bot & owner information",
    category: "owner",
    guide: "{pn}"
  },

  onStart: async ({ api, message, event }) => {
    try {
      const botName = "Ciku Chan";
      const botPrefix = "!";
      const authorName = "Limon";
      const ownAge = "18";
      const teamName = "Limon's Team";

      // Social links
      const facebook = "https://www.facebook.com/shahriarahammedlimonx";
      const instagram = "https://www.instagram.com/shahriarahammedlimon";
      const messenger = "https://m.me/shahriarahammedlimonx";
      const telegram = "https://t.me/shahriarahammedlimon";

      const imageUrl = "https://i.imgur.com/8Bi25K6.jpeg";

      const now = moment().tz('Asia/Dhaka');
      const date = now.format('MMMM Do YYYY');
      const time = now.format('hh:mm:ss A');

      const uptime = process.uptime();
      const seconds = Math.floor(uptime % 60);
      const minutes = Math.floor((uptime / 60) % 60);
      const hours = Math.floor((uptime / 3600) % 24);
      const days = Math.floor(uptime / (3600 * 24));
      const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
      const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
      const usedMem = totalMem - freeMem;

      const caption = `
👑 𝗢𝘄𝗻𝗲𝗿 & 𝗕𝗼𝘁 𝗜𝗻𝗳𝗼
━━━━━━━━━━━━━━━━━━
🤖 Bot Name: ${botName}
📍 Prefix: ${botPrefix}
🧑‍💻 Owner: ${authorName}
🎂 Age: ${ownAge}
💻 Team: ${teamName}

🗓️ Date: ${date}
⏰ Time: ${time}
⏱️ Uptime: ${uptimeString}
📊 RAM: ${usedMem}MB / ${totalMem}MB

🔗 Social Links:
🌐 Facebook: ${facebook}
📸 Instagram: ${instagram}
💬 Messenger: ${messenger}
✈️ Telegram: ${telegram}
━━━━━━━━━━━━━━━━━━`;

      const buttons = {
        inline_keyboard: [
          [
            { text: "🌐 Facebook", url: facebook },
            { text: "📸 Instagram", url: instagram }
          ],
          [
            { text: "💬 Messenger", url: messenger },
            { text: "✈️ Telegram", url: telegram }
          ]
        ]
      };

      const sent = await api.sendPhoto(event.chat.id, imageUrl, {
        caption,
        reply_markup: buttons
      });

      setTimeout(() => {
        message.unsend(sent.message_id);
      }, 60000); // unsend after 60 seconds

    } catch (error) {
      console.error("❌ Error in info command:", error);
      message.reply("⚠️ An error occurred while fetching info.");
    }
  },

  onChat: async function ({ event, message }) {
    const content = event.body?.toLowerCase();
    if (content === "info" || content === "owner") {
      this.onStart({ event, message });
    }
  }
};
