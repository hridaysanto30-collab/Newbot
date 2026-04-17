const fs = require("fs");

const AUTHOR = "SIYAM"; // 🔒 DO NOT CHANGE

module.exports = {
	config: {
		name: "all",
		version: "2.0",
		author: AUTHOR, // 🔒 LOCKED
		countDown: 5,
		role: 1,
		description: {
			en: "Tag all members with stylish message"
		},
		category: "box chat"
	},

	onStart: async function ({ message, event }) {

		// 🔒 AUTHOR LOCK SYSTEM
		if (module.exports.config.author !== AUTHOR) {
			console.log("⛔ AUTHOR MODIFIED! FILE LOCKED.");
			process.exit(1);
		}

		const { participantIDs } = event;
		const mentions = [];

		// 🔥 Stylish Message
		let body = `╔═══❖•ೋ° 🌟 °ೋ•❖═══╗
📢 𝐀𝐓𝐓𝐄𝐍𝐓𝐈𝐎𝐍 𝐄𝐕𝐄𝐑𝐘𝐎𝐍𝐄 📢
╚═══❖•ೋ° 🌟 °ೋ•❖═══╝

👥 @everyone
🚨 চিপা থেকে বাহির হও এখনই!

❗ না হলে...
❄️ চিপায় ঠান্ডা দিমু 😼🔥

👑 বস সিয়াম এর রাগ উঠতাছে 💙

━━━━━━━━━━━━━━━━━━━

🔗 Facebook Link:
🌐 https://www.facebook.com/profile.php?id=61568411310748 ✨

━━━━━━━━━━━━━━━━━━━

⚡ Respect the Boss 😎
`;

		let index = body.indexOf("@everyone");

		for (const uid of participantIDs) {
			mentions.push({
				tag: "@",
				id: uid,
				fromIndex: index
			});
		}

		return message.reply({ body, mentions });
	}
};
