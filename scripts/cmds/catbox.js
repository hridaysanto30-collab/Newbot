const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

/**
 * 🔒 AUTHOR LOCK SYSTEM
 */
const SOURCE_CODE = fs.readFileSync(__filename, "utf8");
if (!SOURCE_CODE.includes('author: "FARHAN-KHAN"')) {
  console.error("❌ FILE LOCKED: Author has been modified!");
  process.exit(1);
}

module.exports = {
  config: {
    name: "catbox",
    version: "1.0.3",
    author: "FARHAN-KHAN",
    role: 0,
    shortDescription: "Upload media to Catbox",
    longDescription: "Reply to media file to upload and get link",
    category: "media",
    guide: "[reply to image/video/audio]",
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;

    try {
      if (!messageReply || !messageReply.attachments?.length) {
        return api.sendMessage(
          "❐ Reply to a photo/video/audio file.",
          threadID,
          messageID
        );
      }

      const links = [];

      for (const att of messageReply.attachments) {
        try {
          // 🔍 Fix: ensure valid URL
          const fileUrl = att.url || att.previewUrl;
          if (!fileUrl) continue;

          const ext =
            att.type === "photo" ? "jpg" :
            att.type === "video" ? "mp4" :
            att.type === "audio" ? "mp3" :
            att.type === "animated_image" ? "gif" : "dat";

          const filePath = path.join(
            __dirname,
            `catbox_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
          );

          // 📥 Download file
          const res = await axios({
            url: fileUrl,
            method: "GET",
            responseType: "stream"
          });

          const writer = fs.createWriteStream(filePath);
          res.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
          });

          // 📤 Upload to Catbox
          const form = new FormData();
          form.append("reqtype", "fileupload");
          form.append("fileToUpload", fs.createReadStream(filePath));

          const upload = await axios.post(
            "https://catbox.moe/user/api.php",
            form,
            { headers: form.getHeaders() }
          );

          if (upload.data && upload.data.startsWith("http")) {
            links.push(upload.data.trim());
          } else {
            links.push("❌ Upload failed");
          }

          // 🗑 Delete temp file
          fs.unlinkSync(filePath);

        } catch (err) {
          console.log("❌ Error:", err.message);
          links.push("❌ Failed");
        }
      }

      if (!links.length) {
        return api.sendMessage("❌ No files processed!", threadID, messageID);
      }

      return api.sendMessage(
        "✅ Uploaded:\n\n" + links.join("\n"),
        threadID,
        messageID
      );

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ Something went wrong!", threadID);
    }
  }
};
