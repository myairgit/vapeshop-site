const canvas = document.getElementById("smokeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Cloud {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.size = Math.random() * 300 + 200; // ОГРОМНЫЕ облака
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.speedY = (Math.random() - 0.5) * 0.1;

    this.alpha = Math.random() * 0.05 + 0.02;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // лёгкое “плавание” от мышки
    if (mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200) {
        this.x += dx / dist * 0.3;
        this.y += dy / dist * 0.3;
      }
    }

    if (
      this.x < -400 ||
      this.x > canvas.width + 400 ||
      this.y < -400 ||
      this.y > canvas.height + 400
    ) {
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
      this.size
    );

    grad.addColorStop(0, `rgba(180,180,180,${this.alpha})`);
    grad.addColorStop(0.5, `rgba(120,120,120,${this.alpha * 0.5})`);
    grad.addColorStop(1, "transparent");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

let clouds = [];
for (let i = 0; i < 6; i++) {
  clouds.push(new Cloud());
}

function animate() {
  // НЕ ЧИСТЫЙ ФОН — чтобы был "накуренный воздух"
  ctx.fillStyle = "rgba(10,10,15,0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  clouds.forEach(c => {
    c.update();
    c.draw();
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});