let modeIndex = 0;

const modes = [
  { name: "Azure Dragon", points: 14 },
  { name: "Vermilion Bird", points: 12 },
  { name: "White Tiger", points: 10 },
  { name: "Black Tortoise", points: 11 }
];

let stars = [];

function setup() {
  const holder = document.getElementById("p5-holder");
  const w = holder ? holder.clientWidth : 900;
  const c = createCanvas(w, 320);
  c.parent("p5-holder");

  seedStars();
}

function windowResized() {
  const holder = document.getElementById("p5-holder");
  const w = holder ? holder.clientWidth : 900;
  resizeCanvas(w, 320);
  seedStars();
}

function seedStars() {
  stars = [];
  const count = modes[modeIndex].points;

  for (let i = 0; i < count; i++) {
    stars.push({
      x: random(width * 0.1, width * 0.9),
      y: random(height * 0.2, height * 0.85),
      r: random(2, 5),
      tw: random(0.6, 1.5)
    });
  }
}

function draw() {
  background(10, 15, 30);

  // subtle cosmic mist
  noStroke();
  for (let i = 0; i < 18; i++) {
    const px = (i / 18) * width;
    const drift = sin(frameCount * 0.01 + i) * 20;
    const py = height * 0.45 + drift;
    const sz = 140 + i * 8;
    fill(120, 180, 255, 8);
    ellipse(px, py, sz, sz * 0.55);
  }

  // mouse-driven wind factor
  const wind = map(mouseX, 0, width, -30, 30);

  // constellation lines
  stroke(240, 210, 80, 120);
  strokeWeight(2);

  for (let i = 0; i < stars.length - 1; i++) {
    const a = stars[i];
    const b = stars[i + 1];

    const ax = a.x + sin(frameCount * 0.01 + i) * a.tw + wind * 0.05;
    const ay = a.y + cos(frameCount * 0.012 + i) * a.tw;
    const bx = b.x + sin(frameCount * 0.01 + i + 1) * b.tw + wind * 0.05;
    const by = b.y + cos(frameCount * 0.012 + i + 1) * b.tw;

    line(ax, ay, bx, by);
  }

  // stars
  noStroke();
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const pulse = 0.6 + 0.4 * sin(frameCount * 0.03 + i);
    fill(255, 255, 255, 220);
    circle(s.x + wind * 0.05, s.y, s.r * (1.2 + pulse));
  }

  // label
  fill(200, 220, 255, 220);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`${modes[modeIndex].name} Constellation — click to switch`, 14, 12);
}

function mousePressed() {
  modeIndex = (modeIndex + 1) % modes.length;
  seedStars();
}
