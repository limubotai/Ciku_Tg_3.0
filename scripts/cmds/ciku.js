const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
  return base.data.api;
};

module.exports = {
  config: {
    name: "ciku",
    aliases: ["baby", "bbe", "babe", "bby"],
    version: "6.9.0",
    author: "Limon",
    countDown: 0,
    role: 0,
    description: "Better than all sim simi",
    category: "chat",
    guide: {
      en: `{pn}[anyMessage]
OR\nteach [YourMessage] - [Reply1], [Reply2], ...
OR\nteach [react] [YourMessage] - [react1], [react2], ...
OR\nremove [YourMessage]
OR\nrm [YourMessage] - [index]
OR\nmsg [YourMessage]
OR\nlist
OR\nall
OR\nedit [YourMessage] - [NewMessage]`
    },
  },

  onStart: async ({ api, event, args, usersData, message }) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.from.id;
    const lowerArg0 = args[0]?.toLowerCase();
    console.log(`[ciku] Command from ${uid}: ${args.join(" ")}`);

    let command, comd, final;

    try {
      if (!args[0]) {
        const responses = ["Bolo baby", "hum", "type help baby", "type !baby hi", "yes baby", "hey baby😃", "hey i am here😃"];
        return message.reply(responses[Math.floor(Math.random() * responses.length)]);
      }

      if (lowerArg0 === "remove") {
        const fina = dipto.replace("remove ", "");
        const { data } = await axios.get(`${link}?remove=${fina}`);
        return message.reply(`${data.message}`);
      }

      if (lowerArg0 === "rm" && dipto.includes("-")) {
        const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
        const { data } = await axios.get(`${link}?remove=${fi}&index=${f}`);
        return message.reply(`${data.message}`);
      }

      if (lowerArg0 === "list") {
        const { data } = await axios.get(`${link}?list=all`);
        return message.reply(`Total Teach = ${data.length}`);
      }

      if (lowerArg0 === "msg" || lowerArg0 === "message") {
        const fuk = dipto.replace("msg ", "");
        const { data } = await axios.get(`${link}?list=${fuk}`);
        return message.reply(`Message ${fuk} = ${data.data}`);
      }

      if (lowerArg0 === "edit") {
        const command = dipto.split(/\s*-\s*/)[1];
        if (command.length < 2) return message.reply("❌ | Invalid format! Use edit [YourMessage] - [NewReply]");
        const res = await axios.get(`${link}?edit=${args[1].toLowerCase()}&replace=${command}`);
        return message.reply(`📝 Changed: ${res.data.message}`);
      }

      if (lowerArg0 === "teach" && args[1]?.toLowerCase() !== "amar" && args[1]?.toLowerCase() !== "react") {
        command = dipto.split(/\s*-\s*/).slice(1).join(' - ');
        comd = dipto.split(/\s*-\s*/)[0];
        final = comd.replace("teach ", "");

        if (command.length < 2)
          return message.reply("❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2]...");

        const { data: resData } = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
        const userName = await usersData.getName(uid);
        return message.reply(`✅ Replies added: ${resData.message}\n👤 Teacher: ${userName}\n📚 Teachs: ${resData.teachs}`);
      }

      if (lowerArg0 === "teach" && args[1]?.toLowerCase() === "amar" && args[2]?.toLowerCase() === "name") {
        command = dipto.split(/\s*-\s*/)[1];
        comd = dipto.split(/\s*-\s*/)[0];
        final = comd.replace("teach ", "");
        if (command.length < 2)
          return message.reply("❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2]...");
        const { data } = await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`);
        return message.reply(`✅ Replies added: ${data.message}`);
      }

      if (lowerArg0 === "teach" && args[1]?.toLowerCase() === "react") {
        command = dipto.split(/\s*-\s*/)[1];
        comd = dipto.split(/\s*-\s*/)[0];
        final = comd.replace("teach react ", "");

        if (command.length < 2)
          return message.reply("❌ | Invalid format! Use [YourMessage] - [React1], [React2]...");

        const { data } = await axios.get(`${link}?teach=${final}&react=${command}`);
        return message.reply(`✅ Reactions added: ${data.message}`);
      }

      if (
        dipto.includes("amar name ki") ||
        dipto.includes("amr nam ki") ||
        dipto.includes("amar nam ki") ||
        dipto.includes("amr name ki")
      ) {
        const { data } = await axios.get(`${link}?text=amar name ki&senderID=${uid}`);
        return message.reply(`${data.reply}`);
      }

      if (lowerArg0 === "find" || lowerArg0 === "-f") {
        const query = dipto.replace(/^(?:-f|find) /, '');
        const { data } = await axios.get(`${link}?find=${query}`);
        const msg = data.result.map(item =>
          Object.entries(item).map(([k, v]) => `${k}: ${v}`).join('\n')
        ).join('\n\n');
        return message.reply(msg);
      }

      // Default chat reply
      const { data } = await axios.get(`${link}?text=${dipto}&senderID=${uid}`);
      const replyMessage = await message.reply(`🤖 ${data.reply}`);

      global.functions.onReply.set(replyMessage.message_id, {
        commandName: 'baby',
        type: "reply",
        messageID: replyMessage.message_id,
        author: uid,
        link: data.reply,
      });

    } catch (e) {
      console.log("[ciku-error]", e);
      message.reply("❌ An error occurred! Try again or check logs for details.");
    }
  },

  onReply: async function ({ event, message }) {
    const link = `${await baseApiUrl()}/baby`;
    const uid = event.from.id;
    const reply = event.text.toLowerCase();

    if (isNaN(reply)) {
      const { data } = await axios.get(`${link}?text=${encodeURIComponent(reply)}&senderID=${uid}`);
      const replyMsg = await message.reply(`🤖 ${data.reply}`);

      global.functions.onReply.set(replyMsg.message_id, {
        commandName: 'baby',
        type: "reply",
        messageID: replyMsg.message_id,
        author: uid,
        link: data.reply,
      });
    }
  }
};
