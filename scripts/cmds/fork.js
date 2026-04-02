const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fork",
    aliases: ["repo", "link"],
    version: "1.3",
    author: "Farhan",
    countDown: 3,
    role: 0,
    longDescription: "Send fork with styled image",
    category: "system",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    try {

      const text = `⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
‎    ╭•┄┅══❁♻️❁══┅┄•╮
 •—»✨𝗢𝗪𝗡𝗘𝗥 𝗙𝗢𝗥𝗞✨«—•
‎    ╰•┄┅══❁♻️❁══┅┄•╯
‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
‎╔══════════════════╗
‎║👉-এই নাও বস ফারহান এর\nɢɪᴛʜᴜʙ ᴀᴄᴄᴏᴜɴᴛ  লিংক ফলো \nকরে দিও-♻️👇
‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
       ‎[>https://github.com/FARHAN-MIRAI-BOT/SIZUKA<]
╠══════════════════╣`;

      const imgUrl = "https://files.catbox.moe/0usiw5.jpg";

      const cachePath = path.join(__dirname, "cache");

      // cache folder create if not exists
      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
      }

      const filePath = path.join(cachePath, "fork.jpg");

      const response = await axios.get(imgUrl, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      await message.reply({
        body: text,
        attachment: fs.createReadStream(filePath)
      });

      // delete file after send
      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      message.reply("❌ Error sending fork!");
    }
  }
};
