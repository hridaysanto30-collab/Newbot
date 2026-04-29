const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gif-encoder-2");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "owner3",
    version: "10.0",
    author: "Siyam Ultra Premium",
    countDown: 0,
    role: 0,
    shortDescription: "Ultra Premium Owner Card",
    category: "utility"
  },

  onStart: async function ({ message, api }) {
    try {

      // 🔁 CARD CYCLE SYSTEM
      if (!global.ownerCardIndex) global.ownerCardIndex = 0;
      const cardIndex = global.ownerCardIndex;

      global.ownerCardIndex++;
      if (global.ownerCardIndex >= 3) global.ownerCardIndex = 0;

      // ⏳ LOADING MESSAGE
      const loadingMsg = await message.reply("🔍 Searching Admin Info...");
      await new Promise(r => setTimeout(r, 5000));
      try { await api.unsendMessage(loadingMsg.messageID); } catch {}

      // ======================
      // 🎨 START CARD
      // ======================

      const up = process.uptime();
      const h = Math.floor(up / 3600);
      const m = Math.floor((up % 3600) / 60);

      const avatar = await loadImage("https://i.imgur.com/lx061ey.jpeg");

      const width = 1000;
      const height = 600;

      const encoder = new GIFEncoder(width, height);
      const filePath = path.join(__dirname, `owner3_${cardIndex}.gif`);

      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(100);
      encoder.setQuality(10);

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // ⭐ STARS
      const stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2
      }));

      function drawStars(frame) {
        ctx.fillStyle = "#fff";
        stars.forEach(s => {
          let y = (s.y + frame * s.speed) % height;
          ctx.beginPath();
          ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      function nebula(frame) {
        const g = ctx.createRadialGradient(
          width/2 + Math.sin(frame*0.05)*200,
          height/2,
          100,
          width/2,
          height/2,
          600
        );

        if (cardIndex === 0) g.addColorStop(0, "rgba(255,0,102,0.4)");
        if (cardIndex === 1) g.addColorStop(0, "rgba(0,255,255,0.4)");
        if (cardIndex === 2) g.addColorStop(0, "rgba(255,215,0,0.4)");

        g.addColorStop(1, "rgba(0,0,0,0.9)");

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // 💎 PREMIUM TEXT
      function premiumText(t, x, y, size, colors, glow = true) {
        const grad = ctx.createLinearGradient(x, y - size, x + 400, y);

        colors.forEach((c, i) => {
          grad.addColorStop(i / (colors.length - 1), c);
        });

        ctx.font = `bold ${size}px Sans`;
        ctx.fillStyle = grad;

        if (glow) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = colors[0];
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.strokeText(t, x, y);

        ctx.fillText(t, x, y);

        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < 60; i++) {

        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, width, height);

        drawStars(i);
        nebula(i);

        // FRAME
        ctx.lineWidth = 8;
        ctx.strokeStyle = ["#ff4d6d","#00ffff","#ffd700"][cardIndex];
        ctx.strokeRect(20, 20, 960, 560);

        // HEART
        ctx.beginPath();
        ctx.moveTo(500, 300);
        ctx.bezierCurveTo(500, 200, 350, 200, 350, 300);
        ctx.bezierCurveTo(350, 420, 500, 500, 500, 550);
        ctx.bezierCurveTo(500, 500, 650, 420, 650, 300);
        ctx.bezierCurveTo(650, 200, 500, 200, 500, 300);
        ctx.closePath();
        ctx.strokeStyle = "rgba(255,0,100,0.4)";
        ctx.stroke();

        // WATERMARK
        ctx.globalAlpha = 0.06;
        premiumText(
          "UDAY HASAN SIYAM",
          260,
          100,
          70,
          ["#ffffff","#999999"],
          false
        );
        ctx.globalAlpha = 1;

        // PROFILE ROTATION
        const cx = 200;
        const cy = 300;
        const angle = (i % 20) * (Math.PI * 2 / 20);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.arc(0, 0, 90, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, -90, -90, 180, 180);
        ctx.restore();

        // RING LIGHT
        for (let k = 0; k < 8; k++) {
          const a = angle + (k * Math.PI / 4);
          const x = cx + Math.cos(a) * 115;
          const y = cy + Math.sin(a) * 115;

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = ["#ff4d6d","#00ffff","#ffd700","#00ff99","#ff00ff","#ffffff","#ff8800","#00aaff"][k];
          ctx.shadowBlur = 15;
          ctx.shadowColor = ctx.fillStyle;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // TEXT
        premiumText(
          "𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 𝐒𝐈𝐘𝐀𝐌",
          300,
          150,
          36,
          [
            ["#ffd700","#fff8dc","#ffd700"],
            ["#00ffff","#ffffff","#00ffff"],
            ["#ff4d6d","#ff99aa","#ff4d6d"]
          ][cardIndex]
        );

        premiumText("Name : Uday Hasan Siyam", 350, 220, 26, ["#ffffff","#cbd5f5"]);
        premiumText("Home : Kishoreganj", 350, 260, 26, ["#ffffff","#cbd5f5"]);
        premiumText("Study : Class 10", 350, 300, 26, ["#ffffff","#cbd5f5"]);
        premiumText("Status : Single 😎", 350, 340, 26, ["#ffffff","#cbd5f5"]);

        premiumText(`Running : ${h}h ${m}m`, 350, 400, 24, ["#38bdf8","#0ea5e9"]);

        premiumText("NIJHUM BOT ⚡", 350, 460, 30, ["#22c55e","#4ade80","#22c55e"]);

        encoder.addFrame(ctx);
      }

      encoder.finish();
      fs.writeFileSync(filePath, encoder.out.getData());

      return message.reply({
        body: `🔥 Card ${cardIndex + 1}/3 Ready`,
        attachment: fs.createReadStream(filePath)
      });

    } catch (e) {
      return message.reply("❌ Error: " + e.message);
    }
  }
};
