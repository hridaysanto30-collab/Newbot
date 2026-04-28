const axios = require("axios");

const NIJHUM_API = "https://exxai.onrender.com";

// ─── Typing Indicator ──────────────────────────────────────────────────────
const typing = async (api, threadID, ms = 3000) => {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(resolve => setTimeout(resolve, ms));
      await api.sendTypingIndicator(threadID, false);
    }
  } catch {}
};

// ─── Sender Name Helper ────────────────────────────────────────────────────
const getSenderName = async (usersData, senderID) => {
  try {
    return (await usersData.getName(senderID)) || "User";
  } catch {
    return "User";
  }
};

// ─── Nijhum API Call ───────────────────────────────────────────────────────
const askNijhum = async (message, senderName, senderID) => {
  const res = await axios.get(`${NIJHUM_API}/api/chat`, {
    params: { message, uid: senderID, name: senderName },
    timeout: 20000
  });
  if (res.data?.success && res.data?.reply) return res.data.reply;
  throw new Error(res.data?.error || "Nijhum is busy right now 💔");
};

// ─── Send Reply (multiple parts support) ──────────────────────────────────
const sendReply = async (message, replyText, senderID, senderName) => {
  const parts = replyText
    .split(/\n\n---\n\n|\n---\n/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const part of parts) {
    await new Promise(resolve => {
      message.reply(`🌸 নিঝুম\n━━━━━━━━━━━━━━\n${part}`, (err, info) => {
        if (!err && info?.messageID) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "nijhum",
            senderID,
            senderName
          });
        }
        resolve();
      });
    });
    if (parts.length > 1) await new Promise(r => setTimeout(r, 800));
  }
};

// ──────────────────────────────────────────────────────────────────────────
module.exports = {
  config: {
    name: "nijhum",
    aliases: ["nij", "ai", "n"],
    version: "2.1",
    author: "SIYAM",
    countDown: 0,
    role: 0,
    shortDescription: "Nijhum AI — romantic & friendly chatbot",
    longDescription:
      "Nijhum — a romantic, friendly, and smart AI. Chat in Bangla, English or Banglish! Supports reply-chain, typing indicator, and multiple messages.",
    category: "ai",
    guide: {
      en:
        "{p}nijhum [message]  — Chat with Nijhum AI\n" +
        "{p}nijhum            — Show help\n\n" +
        "💡 Trigger (without prefix):\n" +
        "  Start your message with 'nijhum <msg>' to get a reply\n\n" +
        "🔗 Reply to Nijhum's message to continue the conversation!"
    }
  },

  // ────────────────────────────────────────────────────────────────────────
  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const threadID = event.threadID;
    const senderName = await getSenderName(usersData, senderID);
    const query = args.join(" ").trim();

    if (!query) {
      return message.reply(
        "🌸 𝗡𝗶𝗷𝗵𝘂𝗺 𝗔𝗜\n" +
        "━━━━━━━━━━━━━━━━\n" +
        "💬 Usage: .nijhum <your message>\n" +
        "📌 Example: .nijhum how are you today?\n" +
        "━━━━━━━━━━━━━━━━\n" +
        "🗣️ Trigger: Start with 'nijhum <msg>' to chat without prefix\n" +
        "🔗 Reply to Nijhum's message to keep the conversation going\n" +
        "━━━━━━━━━━━━━━━━\n" +
        "🔧 Developer: SIYAM"
      );
    }

    try {
      await typing(api, threadID, 2500);
      const reply = await askNijhum(query, senderName, senderID);
      await sendReply(message, reply, senderID, senderName);
    } catch (err) {
      console.error("[Nijhum onStart]", err.message);
      if (err.code === "ECONNABORTED") {
        return message.reply("⏳ Nijhum is taking too long (timeout). Please try again!");
      }
      return message.reply(`❌ ${err.message || "Cannot connect to Nijhum. Please check the server!"}`);
    }
  },

  // ────────────────────────────────────────────────────────────────────────
  onReply: async function ({ api, event, message, usersData }) {
    const text = event.body?.trim();
    if (!text) return;

    const senderID = event.senderID;
    const threadID = event.threadID;
    const senderName = await getSenderName(usersData, senderID);

    try {
      await typing(api, threadID, 2500);
      const reply = await askNijhum(text, senderName, senderID);
      await sendReply(message, reply, senderID, senderName);
    } catch (err) {
      console.error("[Nijhum onReply]", err.message);
      if (err.code === "ECONNABORTED") {
        message.reply("⏳ Nijhum is taking too long (timeout). Please try again!");
      }
    }
  },

  // ────────────────────────────────────────────────────────────────────────
  onChat: async function ({ api, event, message, usersData }) {
    const raw = event.body?.trim() || "";
    if (!raw) return;

    const lower = raw.toLowerCase();
    const senderID = event.senderID;
    const threadID = event.threadID;

    const prefixes = ["nijhum ", "nij ", "n "];
    const matchedPrefix = prefixes.find(p => lower.startsWith(p));
    if (!matchedPrefix) return;

    const q = raw.slice(matchedPrefix.length).trim();
    if (!q) return;

    const senderName = await getSenderName(usersData, senderID);

    try {
      await typing(api, threadID, 2500);
      const reply = await askNijhum(q, senderName, senderID);
      await sendReply(message, reply, senderID, senderName);
    } catch (err) {
      console.error("[Nijhum onChat]", err.message);
      if (err.code === "ECONNABORTED") {
        message.reply("⏳ Nijhum is taking too long (timeout). Please try again!");
      }
    }
  }
};
