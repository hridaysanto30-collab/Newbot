const axios = require("axios");

const AUTHOR = "SIYAM";
const autoTagThreads = new Map();

module.exports = {
	config: {
		name: "autotag",
		version: "7.0",
		author: AUTHOR,
		countDown: 5,
		role: 1,
		category: "box chat"
	},

	onStart: async function ({ message, event, args, api }) {

		if (module.exports.config.author !== AUTHOR) {
			process.exit(1);
		}

		const threadID = event.threadID;

		// ❌ OFF SYSTEM
		if (args[0] === "off") {
			if (autoTagThreads.has(threadID)) {
				clearInterval(autoTagThreads.get(threadID));
				autoTagThreads.delete(threadID);
				return message.reply("❌ AUTO TAG OFF");
			}
			return message.reply("⚠️ Already OFF");
		}

		// ⚠️ Already running
		if (autoTagThreads.has(threadID)) {
			return message.reply("⚠️ Already ON");
		}

		// ⏰ MAIN INTERVAL (2 HOURS)
		const interval = setInterval(async () => {
			try {
				const threadInfo = await api.getThreadInfo(threadID);
				const participantIDs = threadInfo.participantIDs;

				const now = new Date();

				// 🇧🇩 REAL-TIME BD TIME
				const time = now.toLocaleTimeString("en-US", {
					timeZone: "Asia/Dhaka",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: true
				});

				const date = now.toLocaleDateString("en-GB", {
					timeZone: "Asia/Dhaka",
					day: "2-digit",
					month: "long",
					year: "numeric"
				});

				// 🌦️ WEATHER
				let weather = "Loading...";
				try {
					const res = await axios.get("https://wttr.in/Dhaka?format=3");
					weather = res.data;
				} catch {}

				// 🎭 RANDOM EMOJI
				const emojis = ["🔥","💀","😈","⚡","👑","💣"];
				const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

				let body = `
╔══════🚨══════╗
𝐀𝐓𝐓𝐄𝐍𝐓𝐈𝐎𝐍 𝐄𝐕𝐄𝐑𝐘𝐎𝐍𝐄 ${randomEmoji}
╚══════🚨══════╝
👥 @everyone
🚨 SYSTEM ALERT ACTIVATED 🚨
⚡ Please come online RIGHT NOW!
😈 BOSS SIYAM IS WATCHING 👀🔥
━━━━━━━━━━━━━━━━━━━

⏰ Time: ${time}
📅 Date: ${date}
🌦️ Weather: ${weather}

━━━━━━━━━━━━━━━━━━━

╔═━──━▓██▓━──━═╗
👑 𝐕𝐈𝐑𝐓𝐔𝐀𝐋 𝐊𝐈𝐍𝐆 👑
╚═━──━▓██▓━──━═╝
⚔️ 𝐍𝐀𝐌𝐄 ➤ UDAY HASAN SIYAM 🤖
🏡 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 ➤ KISHOREGANJ 🇧🇩
📚 𝐄𝐃𝐔 ➤ CLASS 10
🎂 𝐀𝐆𝐄 ➤ 17+
💔 𝐒𝐓𝐀𝐓𝐔𝐒 ➤ SINGLE
🏫 𝐒𝐂𝐇𝐎𝐎𝐋 ➤ M A MANNAN MANIK HIGH SCHOOL
👨‍🎓 𝐏𝐑𝐎 ➤ STUDENT
━━━━━━━━━━━━━━━━━━━
🔥 "I STAY CALM, NOT WEAK...
⚡ MY NAME IS ENOUGH!" 😈
━━━━━━━━━━━━━━━━━━━

🔗 Facebook:
https://www.facebook.com/share/1AH1QrvdSK/

━━━━━━━━━━━━━━━━━━━

👑━━━⚡━━━👑
𝐑𝐄𝐒𝐏𝐄𝐂𝐓 𝐓𝐇𝐄 𝐁𝐎𝐒𝐒 😎
👑━━━⚡━━━👑
`;

				let index = body.indexOf("@everyone");
				const mentions = [];

				for (const uid of participantIDs) {
					mentions.push({
						tag: "@",
						id: uid,
						fromIndex: index
					});
				}

				// 📤 SEND MESSAGE
				api.sendMessage({ body, mentions }, threadID, (err, info) => {
					if (!err) {
						// 🗑️ AUTO DELETE AFTER 2 MINUTES
						setTimeout(() => {
							api.unsendMessage(info.messageID);
						}, 2 * 60 * 1000);
					}
				});

			} catch (err) {
				console.log(err);
			}

		}, 2 * 60 * 60 * 1000); // ⏰ 2 HOURS

		autoTagThreads.set(threadID, interval);

		return message.reply("✅ AUTO TAG STARTED (Every 2 Hours)");
	}
};
