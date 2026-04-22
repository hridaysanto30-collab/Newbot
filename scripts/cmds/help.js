const axios = require("axios");
const { getPrefix, getStreamFromURL } = global.utils;
const { commands } = global.GoatBot;
const fs = require("fs");

let xfont = {};
let yfont = {};
let categoryEmoji = {};

// 🎬 UPDATED HELP VIDEO (YOUR LINK)
const HELP_GIF = "https://files.catbox.moe/4j7c2m.mp4";

// 🔒 AUTHOR LOCK SYSTEM
const AUTHOR_NAME = "FARHAN-KHAN";

function checkAuthorLock() {
  try {
    const data = fs.readFileSync(__filename, "utf-8");
    const clean = data.replace(/\s/g, "");
    const target = `author:"${AUTHOR_NAME}"`;

    if (!clean.includes(target)) {
      console.log("❌ AUTHOR CHANGED!");
      return false;
    }
    return true;
  } catch (e) {
    console.log("❌ LOCK ERROR:", e);
    return false;
  }
}

async function loadResources() {
  try {
    const [x, y, c] = await Promise.all([
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/xfont.json"),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/yfont.json"),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/category.json")
    ]);

    xfont = x.data || {};
    yfont = y.data || {};
    categoryEmoji = c.data || {};
  } catch (e) {
    console.error("❌ Resource Load Failed");
  }
}

function fontConvert(text, type = "command") {
  const map = type === "category" ? xfont : yfont;
  if (!map || typeof map !== "object") return text;
  return text.split("").map(c => map[c] || c).join("");
}

function getCategoryEmoji(cat) {
  return categoryEmoji?.[cat.toLowerCase()] || "🗂️";
}

function roleText(role) {
  const roles = {
    0: "All Users",
    1: "Group Admins",
    2: "Bot Admin"
  };
  return roles[role] || "Unknown";
}

function findCommand(name) {
  name = name.toLowerCase();

  for (const [, cmd] of commands) {
    if (!cmd?.config) continue;

    if (cmd.config.name === name) return cmd;

    const aliases = cmd.config.aliases;
    if (Array.isArray(aliases) && aliases.includes(name)) return cmd;
    if (typeof aliases === "string" && aliases === name) return cmd;
  }

  return null;
}

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "2.2",
    author: "FARHAN-KHAN",
    role: 0,
    category: "info",
    shortDescription: "Show all commands",
    guide: "{pn} | {pn} <command> | {pn} -c <category>"
  },

  onStart: async function ({ message, args, event, role }) {

    if (!checkAuthorLock()) {
      return message.reply("❌ FILE LOCKED! DON'T CHANGE AUTHOR.");
    }

    if (!xfont || !yfont) await loadResources();

    const prefix = getPrefix(event.threadID);
    const input = args.join(" ").trim();

    const categories = {};

    for (const [name, cmd] of commands) {
      if (!cmd?.config || cmd.config.role > role) continue;

      const cat = (cmd.config.category || "UNCATEGORIZED").toUpperCase();

      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    // 🔍 CATEGORY VIEW
    if (args[0] === "-c" && args[1]) {
      const cat = args[1].toUpperCase();

      if (!categories[cat]) {
        return message.reply(`❌ Category "${cat}" not found`);
      }

      let msg = `╭─────✰『 ${getCategoryEmoji(cat)} ${fontConvert(cat, "category")} 』\n`;

      for (const c of categories[cat].sort()) {
        msg += `│⚡ ${fontConvert(c)}\n`;
      }

      msg += `╰────────────✰\n`;
      msg += `> TOTAL: ${categories[cat].length}\n> PREFIX: ${prefix}`;

      return message.reply({
        body: msg,
        attachment: await getStreamFromURL(HELP_GIF)
      });
    }

    // 📜 FULL LIST
    if (!input) {
      let msg = `╭───────❁\n│✨ 𝐃-𝐒 𝐒𝐈𝐘𝐀𝐌 HELP LIST ✨\n╰────────────❁\n`;

      for (const cat of Object.keys(categories).sort()) {
        msg += `╭─────✰『 ${getCategoryEmoji(cat)} ${fontConvert(cat, "category")} 』\n`;

        for (const c of categories[cat].sort()) {
          msg += `│⚡ ${fontConvert(c)}\n`;
        }

        msg += `╰────────────✰\n`;
      }

      const total = Object.values(categories).reduce((a, b) => a + b.length, 0);

      msg += `╭─────✰\n│ TOTAL COMMANDS: ${total}\n│ PREFIX: ${prefix}\n [https://www.facebook.com/share/1LDy7c49aK/]╰────────────✰`;

      return message.reply({
        body: msg,
        attachment: await getStreamFromURL(HELP_GIF)
      });
    }

    // 🔎 COMMAND INFO
    const cmd = findCommand(input);

    if (!cmd) {
      return message.reply(`❌ Command "${input}" not found`);
    }

    const c = cmd.config;

    const aliasText = Array.isArray(c.aliases)
      ? c.aliases.join(", ")
      : c.aliases || "None";

    let usage = "No usage";

    if (c.guide) {
      usage = typeof c.guide === "string"
        ? c.guide
        : c.guide.en || Object.values(c.guide)[0];

      usage = usage.replace(/{pn}/g, `${prefix}${c.name}`);
    }

    const infoMsg = `
╭─── COMMAND INFO ───╮
🔹 Name : ${c.name}
📂 Category : ${(c.category || "UNCATEGORIZED").toUpperCase()}
📜 Description : ${c.longDescription || c.shortDescription || "N/A"}
🔁 Aliases : ${aliasText}
⚙️ Version : ${c.version || "1.0"}
🔐 Permission : ${roleText(c.role)}
⏱️ Cooldown : ${c.countDown || 5}s
👑 Author : ${c.author || "Unknown"}
📖 Usage : ${usage}
╰───────────────────╯`;

    return message.reply({
      body: infoMsg,
      attachment: await getStreamFromURL(HELP_GIF)
    });
  }
};
