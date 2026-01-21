const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "Mᴏʜᴀᴍᴍᴀᴅ Aᴋᴀsʜ",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       :𝗦𝗜𝗬𝗔𝗠 𝗔𝗛𝗠𝗘𝗗 𝗥𝗔𝗙𝗜
│ 🧸 Nɪᴄᴋ       :𝗥𝗔𝗙𝗨
│ 🎂 Aɢᴇ        : 17+
│ 💘 Rᴇʟᴀᴛɪᴏɴ : Sɪɴɢʟᴇ
│ 🎓 Pʀᴏғᴇssɪᴏɴ : VONDAMI ultra pro
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : X 10
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ :𝗞𝗵𝘂𝗹𝗻𝗮 - 𝗦𝗵𝗮𝘁𝗸𝗵𝗶𝗿𝗮
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook  :https://www.facebook.com/profile.php?id=61585437908438
│ 💬 Messenger: 
│ 📞 WhatsApp  : wa.me/01815843985
╰────────────────╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/i0yRBmx.jpeg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
