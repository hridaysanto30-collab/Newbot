const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gif-encoder-2");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "owne2",
    version: "6.1",
    author: "Siyam Ultra Premium",
    countDown: 0,
    role: 0,
    shortDescription: "Galaxy Premium Owner Card",
    category: "utility"
  },

  onStart: async function ({ message }) {

    try {

      const up = process.uptime();
      const h = Math.floor(up / 3600);
      const m = Math.floor((up % 3600) / 60);

      const avatar = await loadImage("https://i.imgur.com/lx061ey.jpeg");

      const width = 1000;
      const height = 600;

      const encoder = new GIFEncoder(width, height);
      const filePath = path.join(__dirname, "ee.gif");

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
          width / 2 + Math.sin(frame * 0.05) * 200,
          height / 2,
          100,
          width / 2,
          height / 2,
          600
        );
        g.addColorStop(0, "rgba(147,51,234,0.4)");
        g.addColorStop(0.5, "rgba(59,130,246,0.2)");
        g.addColorStop(1, "rgba(0,0,0,0.9)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      function text(t, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.font = `bold ${size}px Sans`;
        ctx.fillText(t, x, y);
      }

      for (let i = 0; i < 60; i++) {

        const mode = i % 3;

        // 🌌 BACKGROUND
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, width, height);
        drawStars(i);
        nebula(i);

        // 🎨 BORDER
        if (mode === 0) ctx.strokeStyle = "#00f7ff";
        if (mode === 1) ctx.strokeStyle = "#ff4d6d";
        if (mode === 2) ctx.strokeStyle = "#ffd700";

        ctx.lineWidth = 6;
        ctx.strokeRect(20, 20, 960, 560);

        // 💎 GLASS
        let glass = ctx.createLinearGradient(50, 50, 950, 550);
        if (mode === 0) {
          glass.addColorStop(0, "rgba(0,255,255,0.08)");
          glass.addColorStop(1, "rgba(0,0,0,0.5)");
        }
        if (mode === 1) {
          glass.addColorStop(0, "rgba(255,77,109,0.12)");
          glass.addColorStop(1, "rgba(0,0,0,0.55)");
        }
        if (mode === 2) {
          glass.addColorStop(0, "rgba(255,215,0,0.10)");
          glass.addColorStop(1, "rgba(0,0,0,0.55)");
        }

        ctx.fillStyle = glass;
        ctx.fillRect(50, 50, 900, 500);

        // ✨ SHINE
        const shineX = (i * 25) % 1000;
        const shine = ctx.createLinearGradient(shineX - 200, 0, shineX, 600);
        shine.addColorStop(0, "rgba(255,255,255,0)");
        shine.addColorStop(0.5, "rgba(255,255,255,0.15)");
        shine.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = shine;
        ctx.fillRect(50, 50, 900, 500);

        // 🔄 PROFILE ROTATION
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

        // 💡 RING LIGHT
        for (let k = 0; k < 8; k++) {
          const a = angle + (k * Math.PI / 4);
          const x = cx + Math.cos(a) * 115;
          const y = cy + Math.sin(a) * 115;

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = ["#00ffff","#ff00ff","#00ff00","#ffff00","#ff8800","#00aaff","#ffffff","#ff4d6d"][k];
          ctx.shadowBlur = 15;
          ctx.shadowColor = ctx.fillStyle;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // 👑 TITLE
        text("𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 𝐒𝐈𝐘𝐀𝐌", 300, 140, 34, "#ffffff");

        // 📄 INFO (FIXED)
        const color = "#e2e8f0";
        text("Name : Uday Hasan Siyam", 350, 200, 26, color);
        text("Home : Kishoreganj", 350, 240, 26, color);
        text("Study : Class 10", 350, 280, 26, color);
        text("Age : 17+", 350, 320, 26, color);
        text("Status : Single 😎", 350, 360, 26, color);

        // ⏱️ UPTIME
        text(`Running : ${h}h ${m}m`, 350, 420, 24, "#38bdf8");

        // 🚀 FOOTER
        text("NIJHUM BOT ⚡", 350, 480, 28, "#22c55e");

        encoder.addFrame(ctx);
      }

      encoder.finish();
      fs.writeFileSync(filePath, encoder.out.getData());

      return message.reply({
        body: "🔥 Fixed Galaxy Card Ready",
        attachment: fs.createReadStream(filePath)
      });

    } catch (e) {
      return message.reply("❌ Error: " + e.message);
    }
  }
};
