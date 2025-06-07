const axios = require("axios");

module.exports.config = {
  name: "flux",
  version: "2.0",
  role: 0,
  author: "Limon",
  description: "Flux Image Generator",
  category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  premium: true,
  guide: `{pn} [prompt] --ratio [width:height] --type [image|sticker]
Example:
{pn} a cat wearing glasses --ratio 1024x1024
{pn} a funny meme character --type sticker`,
  countDown: 15,
};

module.exports.onStart = async ({ event, args, message }) => {
  const API_BASE = "https://www.noobs-api.rf.gd/dipto";

  try {
    let fullPrompt = args.join(" ");
    let ratio = "1:1";
    let type = "image";

    // Extract --ratio option
    if (fullPrompt.includes("--ratio")) {
      [fullPrompt, ratio] = fullPrompt.split("--ratio").map(s => s.trim());
      ratio = ratio.split(" ")[0]; // Clean up any trailing flags
    }

    // Extract --type option
    if (fullPrompt.includes("--type")) {
      [fullPrompt, type] = fullPrompt.split("--type").map(s => s.trim());
      type = type.split(" ")[0].toLowerCase(); // Normalize
    }

    const cleanPrompt = fullPrompt.trim();
    if (!cleanPrompt) return message.reply("⚠️ Please provide a prompt to generate the image.");

    const waitMsg = await message.reply("🪄 Generating your image, please wait...");
    const startTime = Date.now();

    const apiUrl = `${API_BASE}/flux?prompt=${encodeURIComponent(cleanPrompt)}&ratio=${encodeURIComponent(ratio)}&type=${type}`;

    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);

    // Only unsend if messageID exists
    if (waitMsg?.messageID) {
      await message.unsend(waitMsg.messageID);
    }

    // Send the generated image or sticker
    await message.stream({
      url: apiUrl,
      caption: `✅ Here's your ${type}!\n🕒 Generated in ${timeTaken}s\n👑 Requested by: ${event.senderID}`
    });

  } catch (error) {
    console.error("Flux Error:", error);
    message.reply("❌ An error occurred while generating the image.\nDetails: " + error.message);
  }
};
