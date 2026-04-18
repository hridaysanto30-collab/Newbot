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
    version: "1.0.2",
    author: "FARHAN-KHAN",
    role: 0,
    shortDescription: "Upload media to Catbox",
    longDescription: "Reply to media file to upload and get link",
    category: "media",
    guide: "[reply to image/video/audio]",
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    try {
      const { threadID, messageID, messageReply, type } = event;

      if (type !== "message_reply" || !messageReply?.attachments?.length) {
        return api.sendMessage(
          "❐ Please reply to a photo/video/audio file.",
          threadID,
          messageID
        );
      }

      const files = [];

      // 📥 Download function
      const downloadFile = async (url, filePath) => {
        const res = await axios({
          url,
          method: "GET",
          responseType: "stream"
        });

        const writer = fs.createWriteStream(filePath);
        res.data.pipe(writer);

        return new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      };

      let i = 0;

      for (const att of messageReply.attachments) {
        try {
          const ext =
            att.type === "photo" ? "jpg" :
            att.type === "video" ? "mp4" :
            att.type === "audio" ? "mp3" :
            att.type === "animated_image" ? "gif" : "dat";

          const filePath = path.join(__dirname, `catbox_${Date.now()}_${i}.${ext}`);

          await downloadFile(att.url, filePath);
          files.push(filePath);
          i++;

        } catch (err) {
          console.log("Download error:", err.message);
        }
      }

      if (!files.length) {
        return api.sendMessage("❌ Download failed!", threadID, messageID);
      }

      let links = [];

      for (const file of files) {
        try {
          const form = new FormData();
          form.append("reqtype", "fileupload");
          form.append("fileToUpload", fs.createReadStream(file));

          const res = await axios.post(
            "https://catbox.moe/user/api.php",
            form,
            { headers: form.getHeaders() }
          );

          if (res.data) {
            links.push(res.data.trim());
          } else {
            links.push("❌ Upload failed");
          }

        } catch (err) {
          console.log("Upload error:", err.message);
          links.push("❌ Upload failed");
        } finally {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        }
      }

      return api.sendMessage(
        links.join("\n"),
        threadID,
        messageID
      );

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ Something went wrong!", event.threadID);
    }
  }
};
