module.exports = {
  config: {
    name: "busy_reply",
    version: "6.5.0",
    author: "Milon Pro",
    countDown: 0,
    role: 0,
    description: "Auto-reply when specific target UIDs are mentioned (CMD Version)",
    category: "System",
    guide: "This command works automatically in the background."
  },

/* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
 * 🤖 BOT NAME: MILON BOT
 * 👤 OWNER: MILON HASAN
 * 🔗 FACEBOOK: https://www.facebook.com/share/17uGq8qVZ9/
 * 📞 WHATSAPP: +880 1912603270
 * 📍 LOCATION: NARAYANGANJ, BANGLADESH
 * 🛠️ PROJECT: MILON BOT PROJECT (2026)
 * --------------------------------------- */

  onStart: async function ({ api, event }) {
    // Keep this empty to prevent errors during installation or manual run
  },

  onChat: async function ({ api, event }) {
    const { mentions, threadID, messageID } = event;
    
    // --- [ 🆔 SET YOUR 3 TARGET UIDs HERE ] ---
    const targetUIDs = [
      "61583610247347", 
      "61588452928616", 
      "61588452928616"
    ];

    if (!mentions || Object.keys(mentions).length === 0) return;

    // Checking if any of our target IDs are in the mention list
    const mentionedIDs = Object.keys(mentions);
    const isTargetMentioned = targetUIDs.some(uid => mentionedIDs.includes(uid));

    if (isTargetMentioned) {
      // --- [ 📝 YOUR DIALOGUES ] ---
      const replyMessages = [
        "ঐ ফালতু বস ফারহান কে মেনশন দিবি না, সে এখন অনেক ব্যস্ত! 🤫",
‎        "ফারহান বস কে এতো মেনশন নাহ দিয়া বস কে একটা জি এফ দে 😒😏",
‎        "মেনশন দিয়ে লাভ নাই, ফারহান বস এখন জরুরি কাজে বিজি আছে! 😼",
‎        "ফারহান বস এখন  বিজি জা বলার আমাকে বলতে পারেন_!!😼🥰",
‎        "ফারহান বসকে বেশি মেনশন কিন্তু ব্লক খাবি, এখন ঘুমাচ্ছে! 😴",
‎        "👉আমার বস ♻️ 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এখন বিজি আছে । তার ইনবক্সে এ মেসেজ দিয়ে রাখো [https://www.facebook.com/DARK.XAIKO.420]🔰                                        ♪√বস ফ্রি হলে আসবে🧡😁😜🐒",
‎        "চুপ কর, ফারহান বস এখন খুব জরুরি মিটিং এ আছে। 🤫",
‎        "তাকে ডাকার আগে ফারহান বস এর পারমিশন নিছস? 😒",
‎        "এই যে, ফারহান বস এখন অনলাইনে নাই, পরে আয়। 🏃‍♂️",
‎        "বেশি পকপক করিস না, ফারহান বস এখন মুড অফ করে বসে আছে। 🤐"
      ];
      
      const randReply = replyMessages[Math.floor(Math.random() * replyMessages.length)];

      // Sending the message as a reply to the mentioner
      return api.sendMessage(randReply, threadID, messageID);
    }
  }
};
