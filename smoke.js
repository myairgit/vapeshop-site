const canvas = document.getElementById("smokeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class SmokeFlow {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;

    this.length = Math.random() * 200 + 150;
    this.speed = Math.random() * 0.5 + 0.2;

    this.offset = Math.random() * 1000;
    this.alpha = Math.random() * 0.08 + 0.03;
    this.width = Math.random() * 20 + 10;
  }

  update() {
    this.y -= this.speed;
    this.offset += 0.02;

    if (this.y < -200) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();

    for (let i = 0; i < this.length; i++) {
      let wave = Math.sin((i * 0.05) + this.offset) * 30;

      let x = this.x + wave;
      let y = this.y + i;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(220,220,220,${this.alpha})`;
    ctx.lineWidth = this.width;
    ctx.lineCap = "round";

    ctx.stroke();
  }
}

let smokes = [];
for (let i = 0; i < 12; i++) {
  smokes.push(new SmokeFlow());
}

function animate() {
  ctx.fillStyle = "rgba(10,10,15,0.07)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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