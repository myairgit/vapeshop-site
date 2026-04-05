const canvas = document.getElementById("smokeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: null, y: null };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class VapeSmoke {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 50; // старт снизу
    this.size = Math.random() * 10 + 8;
    this.speedY = Math.random() * 0.3 + 0.2; // поднимается вверх
    this.speedX = (Math.random() - 0.5) * 0.2; // лёгкое колебание
    this.alpha = Math.random() * 0.1 + 0.05;
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;

    // отталкивание от мышки
    if (mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += dx / dist * 0.8;
        this.y += dy / dist * 0.8;
      }
    }

    // ресет когда улетает вверх
    if (this.y < -50 || this.x < -50 || this.x > canvas.width + 50) {
      this.reset();
    }
  }

  draw() {
    const grad = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 4
    );
    grad.addColorStop(0, `rgba(200,200,200,${this.alpha})`);
    grad.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

let smokeArray = [];
for (let i = 0; i < 40; i++) smokeArray.push(new VapeSmoke());

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  smokeArray.forEach((s) => {
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