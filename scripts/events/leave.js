const { getTime } = global.utils;
const axios = require("axios");

module.exports = {
	config: {
		name: "leave",
		version: "2.5",
		author: "NTKhang | Roasted by Grok",
		category: "events"
	},

	onStart: async function ({ threadsData, message, event, api, usersData }) {
		if (event.logMessageType !== "log:unsubscribe") return;

		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		if (!threadData.settings?.sendLeaveMessage) return;

		const { leftParticipantFbId } = event.logMessageData;
		if (leftParticipantFbId == api.getCurrentUserID()) return;

		const userName = await usersData.getName(leftParticipantFbId);
		const isKick = leftParticipantFbId !== event.author; // true = কিক খাইছে, false = নিজে লিভ করছে

		/
		const selfLeaveTexts = [
			`${userName} Left gok gok`
		];

		// 
		const kickTexts = [
			`${userName} আবলামি করার জন্য পার্মানেন্ট কিক খাইলো`
		];

		const finalText = isKick 
			? kickTexts[Math.floor(Math.random() * kickTexts.length)]
			: selfLeaveTexts[Math.floor(Math.random() * selfLeaveTexts.length)];

		const form = {
			body: finalText,
			mentions: [{
				tag: userName,
				id: leftParticipantFbId
			}]
		};

		// তোমার GIF (যেই হোক — লিভ হোক বা কিক, একই GIF যাবে)
		const GIF_LINK = "https://i.ibb.co/60BfHhnq/539351705-1109553464575625-6622039206517931039-n-gif-nc-cat-102-ccb-1-7-nc-sid-cf94fc-nc-eui2-Ae-H.gif";

		let attachments = [];

		// অ্যাডমিন যদি কাস্টম GIF সেট করে তাহলে সেটাই যাবে
		if (threadData.data.leaveAttachment && threadData.data.leaveAttachment.length > 0) {
			for (const fileId of threadData.data.leaveAttachment) {
				try {
					attachments.push(await global.utils.drive.getFile(fileId, "stream"));
				} catch (e) {}
			}
		} 
		// না থাকলে তোমার এই GIF টাই যাবে যাবে
		else {
			try {
				const response = await axios({
					url: GIF_LINK,
					method: "GET",
					responseType: "stream"
				});
				attachments.push(response.data);
			} catch (err) {
				console.log("GIF লোড হয়নি:", err.message);
			}
		}

		if (attachments.length > 0) form.attachment = attachments;

		message.send(form);
	}
};
