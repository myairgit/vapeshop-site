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

    this.length = Math.random() * 250 + 200;
    this.speed = Math.random() * 0.4 + 0.2;

    this.offset = Math.random() * 1000;
    this.alpha = Math.random() * 0.08 + 0.04;
    this.width = Math.random() * 18 + 8;
  }

  update() {
    this.y -= this.speed;
    this.offset += 0.02;

    if (this.y < -300) this.reset();
  }

  draw() {
    ctx.beginPath();

    for (let i = 0; i < this.length; i++) {
      let wave = Math.sin(i * 0.04 + this.offset) * 25;

      let x = this.baseX + wave;
      let y = this.y + i;

      // 💥 влияние мышки (раздувает дым)
      if (mouse.x && mouse.y) {
        let dx = x - mouse.x;
        let dy = y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          x += dx / dist * 15; // сильнее эффект
          y += dy / dist * 10;
        }
      }

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    // 🔥 blur-like эффект (реализм)
    ctx.shadowBlur = 20;
    ctx.shadowColor = `rgba(255,255,255,${this.alpha})`;

    ctx.strokeStyle = `rgba(220,220,220,${this.alpha})`;
    ctx.lineWidth = this.width;
    ctx.lineCap = "round";

    ctx.stroke();

    ctx.shadowBlur = 0;
  }
}

let smokes = [];
for (let i = 0; i < 14; i++) smokes.push(new SmokeFlow());

function animate() {
  // ❌ НЕТ затемнения фона
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  smokes.forEach(s => {
    s.update();
    s.draw();
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});