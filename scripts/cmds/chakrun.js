const os = require("os");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
  config: {
    name: "chakrun",
    aliases: ["ckr"],
    version: "3.0.0",
    author: "Milon Hasan",
    countDown: 5,
    role: 2,
    category: "system",
    usePrefix: false 
  },

/* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
 * 🤖 BOT NAME: MILON BOT
 * 👤 OWNER: MILON HASAN (MILON BOSS)
 * 📍 LOCATION: NARAYANGANJ, BANGLADESH
 * 🛠️ PROJECT: MILON BOT PROJECT (2026)
 * --------------------------------------- */

  onChat: async function ({ api, event, message }) {
    if (!event.body) return;
    const input = event.body.toLowerCase().trim();
    if (input === "chakrun" || input === "ckr") {
      return this.onStart({ api, event, message });
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID } = event;
    const imgURL = "https://i.imgur.com/flVAtpL.jpeg"; // তোমার দেওয়া ইমেজ লিংক
    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, `sysinfo_${threadID}.png`);

    // ক্যাশে ফোল্ডার না থাকলে তৈরি করবে
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const wait = await message.reply("⏳ Generating system info image, please wait...");

    try {
      let hostPlatform = "Unknown Host";
      const platform = os.platform();
      const uptime = process.uptime();
      
      // --- [ 🌐 তোমার দেওয়া হোস্টিং ডিটেকশন লজিক ] ---
      const isRender = process.env.RENDER || 
                       process.env.RENDER_EXTERNAL_URL || 
                       (process.env.HOME && process.env.HOME.includes("/opt/render"));

      const isRailway = process.env.RAILWAY_STATIC_URL || 
                        process.env.RAILWAY_ID || 
                        process.env.RAILWAY_ENVIRONMENT;

      if (isRender) {
        hostPlatform = "Render (Cloud Platform)";
      } else if (isRailway) {
        hostPlatform = "Railway (Cloud Platform)";
      } else if (process.env.HEROKU_APP_ID) {
        hostPlatform = "Heroku (Cloud)";
      } else if (platform === "linux") {
        hostPlatform = "VPS / Dedicated Server (Linux)";
      } else if (platform === "win32") {
        hostPlatform = "Localhost (Windows PC)";
      } else if (platform === "android") {
        hostPlatform = "Termux (Android)";
      }

      // --- [ ⏳ আপটাইম: দিন, ঘণ্টা, মিনিট ] ---
      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);

      // --- [ 🧠 মেমোরি ] ---
      const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

      // --- [ 🎨 CANVAS DRAWING ] ---
      const baseImage = await loadImage(imgURL);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // ব্যাকগ্রাউন্ড ইমেজ ড্র করা
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // টেক্সট স্টাইল সেট করা
      ctx.fillStyle = "#ffffff"; // সাদা রঙের লেখা
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)"; // লেখার পেছনে হালকা ছায়া
      ctx.shadowBlur = 10;
      ctx.textBaseline = "top";

      // শিরোনাম
      ctx.font = "bold 50px Arial"; // বড় ফন্ট
      ctx.fillText("SIZUKA BOT SYSTEM INFO", 50, 50);

      // ইনফরমেশন টেক্সট
      ctx.font = "40px Arial"; // মাঝারি ফন্ট
      const startY = 150;
      const lineHeight = 70;

      ctx.fillText(`🌐 Host: ${hostPlatform}`, 50, startY);
      ctx.fillText(`⚙️ OS: ${platform}`, 50, startY + lineHeight);
      ctx.fillText(`⏳ Uptime: ${days}d ${hours}h ${minutes}m`, 50, startY + lineHeight * 2);
      ctx.fillText(`🧠 Memory: ${memoryUsage} MB`, 50, startY + lineHeight * 3);

      // তোমার নাম (ক্রেডিট)
      ctx.font = "italic 35px Arial";
      ctx.fillStyle = "#cccccc"; // হালকা ধূসর রঙ
      ctx.fillText("Power by:-Farhan Khan", 50, canvas.height - 80);

      // ছবি সেভ করা
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(imgPath, buffer);

      // ছবি পাঠানো
      api.unsendMessage(wait.messageID);
      await message.reply({
        attachment: fs.createReadStream(imgPath)
      });

      // পাঠানোর পর ক্যাশে ফাইল ডিলিট করা
      fs.unlinkSync(imgPath);

    } catch (err) {
      console.error(err);
      api.unsendMessage(wait.messageID);
      return message.reply(`❌ Error generating image: ${err.message}\nMake sure 'canvas' is installed.`);
    }
  }
};
