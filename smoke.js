const canvas = document.getElementById("smokeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class SmokeLine {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.len = Math.random() * 250 + 150;
    this.angle = Math.random() * Math.PI * 2;

    this.speed = Math.random() * 0.2 + 0.05;
    this.alpha = Math.random() * 0.04 + 0.02;
    this.thickness = Math.random() * 40 + 20;
  }

  update() {
    // лёгкое “плавание дыма”
    this.x += Math.sin(this.angle) * this.speed;
    this.y -= this.speed * 0.5;

    this.angle += 0.002;

    // реакция на мышку
    if (mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        this.x += dx / dist * 0.3;
        this.y += dy / dist * 0.3;
      }
    }

    if (this.y < -300) {
      this.reset();
      this.y = canvas.height + 100;
    }
  }

  draw() {
    const grad = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x + this.len,
      this.y - this.len
    );

    grad.addColorStop(0, `rgba(200,200,200,0)`);
    grad.addColorStop(0.5, `rgba(200,200,200,${this.alpha})`);
    grad.addColorStop(1, `rgba(200,200,200,0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = this.thickness;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.len, this.y - this.len);
    ctx.stroke();
  }
}

let smoke = [];
for (let i = 0; i < 18; i++) smoke.push(new SmokeLine());

function animate() {
  ctx.fillStyle = "rgba(10,10,15,0.10)";
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
});