const canvas = document.getElementById("smokeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class SmokeStream {
  constructor() {
    this.reset();
  }

  reset() {
    // старт снизу как “сигарета”
    this.x = window.innerWidth * 0.5 + (Math.random() - 0.5) * 30;
    this.y = window.innerHeight * 0.8;

    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(Math.random() * 0.6 + 0.3);

    this.size = Math.random() * 25 + 15;
    this.life = 0;
    this.maxLife = 200 + Math.random() * 100;

    this.alpha = 0.06 + Math.random() * 0.05;

    this.angle = Math.random() * Math.PI * 2;
  }

  update() {
    this.life++;

    // “дым поднимается”
    this.y += this.vy;
    this.x += this.vx;

    // завихрение (главный эффект сигаретного дыма)
    this.angle += 0.03;
    this.x += Math.sin(this.angle) * 0.6;

    // лёгкая реакция на мышь
    if (mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        this.x += dx / dist * 0.4;
        this.y += dy / dist * 0.4;
      }
    }

    if (this.life > this.maxLife || this.y < -50) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();

    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size
    );

    gradient.addColorStop(0, `rgba(200,200,200,${this.alpha})`);
    gradient.addColorStop(0.4, `rgba(160,160,160,${this.alpha * 0.5})`);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;

    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

let smoke = [];
for (let i = 0; i < 35; i++) smoke.push(new SmokeStream());

function animate() {
  // НЕ полностью очищаем — чтобы оставался шлейф дыма
  ctx.fillStyle = "rgba(10,10,15,0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  smoke.forEach(s => {
    s.update();
    s.draw();
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});ы