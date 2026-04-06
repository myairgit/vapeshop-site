const canvas = document.getElementById("smokeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class SmokeFlow {
  constructor() {
    this.reset();
  }

  reset() {
    this.baseX = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;

    this.length = 300; // фикс длина = плавнее
    this.speed = Math.random() * 0.3 + 0.2;

    this.offset = Math.random() * 1000;
    this.alpha = 0.05;
    this.width = Math.random() * 12 + 8;
  }

  update() {
    this.y -= this.speed;
    this.offset += 0.015; // медленнее = плавнее

    if (this.y < -400) this.reset();
  }

  draw() {
    ctx.beginPath();

    let prevX, prevY;

    for (let i = 0; i < this.length; i++) {
      let t = i / this.length;

      // плавная синусоида (главное!)
      let wave =
        Math.sin(i * 0.02 + this.offset) * 40 +
        Math.sin(i * 0.01 + this.offset * 0.5) * 20;

      let x = this.baseX + wave;
      let y = this.y + i;

      // реакция на мышку (но мягкая!)
      if (mouse.x && mouse.y) {
        let dx = x - mouse.x;
        let dy = y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          let force = (150 - dist) / 150;
          x += dx * force * 0.2;
          y += dy * force * 0.2;
        }
      }

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        // 🔥 СГЛАЖИВАНИЕ (убирает “червей”)
        ctx.quadraticCurveTo(prevX, prevY, x, y);
      }

      prevX = x;
      prevY = y;
    }

    // мягкий градиент прозрачности
    ctx.strokeStyle = `rgba(220,220,220,${this.alpha})`;
    ctx.lineWidth = this.width;
    ctx.lineCap = "round";

    // glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = "rgba(255,255,255,0.15)";

    ctx.stroke();

    ctx.shadowBlur = 0;
  }
}