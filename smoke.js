const canvas = document.getElementById("smokeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Smoke {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = window.innerWidth / 2 + (Math.random() - 0.5) * 50;
    this.y = window.innerHeight;

    this.life = 0;
    this.maxLife = 200;

    this.size = 20;
    this.alpha = 0.15;
    this.angle = Math.random() * Math.PI * 2;
  }

  update() {
    this.life++;

    this.y -= 1;
    this.angle += 0.05;

    this.x += Math.sin(this.angle) * 1.2;

    if (this.life > this.maxLife) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();

    ctx.fillStyle = `rgba(220,220,220,${this.alpha})`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    ctx.fill();
  }
}

let smokes = [];
for (let i = 0; i < 40; i++) smokes.push(new Smoke());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  smokes.forEach(s => {
    s.update();
    s.draw();
  });

  requestAnimationFrame(animate);
}

animate();