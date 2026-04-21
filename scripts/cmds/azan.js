const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "azan",
    version: "22.0.0",
    author: "farhan",
    countDown: 5,
    role: 0,
    description: "Auto Azan Video System with Global ON/OFF",
    category: "Islamic",
    guide: "{pn} on / off"
  },

  // ✅ ON/OFF COMMAND
  onStart: async function ({ api, event, args }) {
    const { threadID } = event;

    if (args[0] === "on") {
      global.azanStatus = true;
      return api.sendMessage("✅ Azan system ON হয়েছে (সব গ্রুপে চালু)", threadID);
    }

    if (args[0] === "off") {
      global.azanStatus = false;
      return api.sendMessage("❌ Azan system OFF হয়েছে (সব গ্রুপে বন্ধ)", threadID);
    }

    return api.sendMessage("⚙️ ব্যবহার:\nazan on / azan off", threadID);
  },

  // ✅ AUTO SYSTEM
  onLoad: async function ({ api }) {
    const azanVidUrl = "https://files.catbox.moe/cvv4ni.mp4";

    // Default ON
    if (global.azanStatus === undefined) global.azanStatus = true;

    if (!global.azanInterval) {
      global.azanInterval = setInterval(async () => {

        // ❌ OFF থাকলে কিছুই করবে না
        if (!global.azanStatus) return;

        const now = moment().tz("Asia/Dhaka");
        const currentTime = now.format("HH:mm");

        try {
          const res = await axios.get(
            `https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=13`
          );

          const p = res.data.data.timings;

          const prayerList = {
            Fajr: p.Fajr,
            Dhuhr: p.Dhuhr,
            Asr: p.Asr,
            Maghrib: p.Maghrib,
            Isha: p.Isha
          };

          const allThreads = await api.getThreadList(100, null, ["INBOX"]);

          for (const thread of allThreads) {
            if (!thread.isGroup) continue;

            const threadID = thread.threadID;

            for (const [name, time] of Object.entries(prayerList)) {

              // ✅ শুধু আজানের সময় ভিডিও
              if (time === currentTime) {
                const vidPath = path.join(__dirname, "cache", `azan_${threadID}.mp4`);

                const { data } = await axios.get(azanVidUrl, {
                  responseType: "arraybuffer"
                });

                fs.writeFileSync(vidPath, Buffer.from(data));

                api.sendMessage(
                  {
                    attachment: fs.createReadStream(vidPath)
                  },
                  threadID,
                  () => {
                    if (fs.existsSync(vidPath)) fs.unlinkSync(vidPath);
                  }
                );
              }

            }
          }

        } catch (err) {
          console.log("Azan Error:", err);
        }

      }, 60000); // প্রতি ১ মিনিটে চেক করবে
    }
  }
};
