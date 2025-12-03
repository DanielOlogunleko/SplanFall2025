

// Paddle properties
let paddleLeftX;
let paddleLeftY;

let paddleRightX;
let paddleRightY;

let paddleSpeed = 3.2;
let paddleHeight = 70;
let paddleWidth = 12;

// Scores
let leftScore = 0;
let rightScore = 0;

// Balls
let balls = [];
let numBalls = 3;
let baseBallSize = 12;

// Background stars for visual flair
let stars = [];

function setup() {
  createCanvas(500, 400);

  rectMode(CENTER);
  ellipseMode(CENTER);
  colorMode(HSB, 360, 100, 100, 100);

  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  textFont('monospace');

  // Paddle positions (a bit away from the edges)
  paddleLeftX = 40;
  paddleLeftY = height / 2;

  paddleRightX = width - 40;
  paddleRightY = height / 2;

  // Stars for animated background
  for (let i = 0; i < 80; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      speed: random(0.2, 0.8),
      size: random(1, 3)
    });
  }

  resetBalls();

  // Start paused – click to start
  noLoop();
}

function draw() {
  // Semi-transparent background for trails
  background(230, 40, 4, 25);

  // Draw moving starfield
  drawStars();

  // Draw center line
  push();
  stroke(200, 10, 60, 40);
  strokeWeight(2);
  drawingContext.setLineDash([10, 10]);
  line(width / 2, 0, width / 2, height);
  pop();

  // Draw paddles with neon glow
  drawPaddle(paddleLeftX, paddleLeftY, 190);
  drawPaddle(paddleRightX, paddleRightY, 320);

  // Draw and update balls
  for (let i = 0; i < balls.length; i++) {
    updateBall(balls[i]);
    drawBall(balls[i]);
  }

  // Draw scores
  fill(50, 0, 100);
  textSize(28);
  text(leftScore, width * 0.25, 40);
  text(rightScore, width * 0.75, 40);

  // Small label
  textSize(16);
  fill(210, 10, 90, 70);
  text("NEON MULTI-PONG", width / 2, height - 20);

  // Move paddles from keyboard + slight auto drift
  handlePaddleInput();

  // Show 'Click to start' if paused
  if (!isLooping()) {
    fill(60, 0, 100);
    textSize(24);
    text('Click to start', width / 2, height / 2 - 10);
    textSize(14);
    text('W/S and ↑/↓ to move', width / 2, height / 2 + 18);
  }
}


function drawStars() {
  noStroke();
  for (let s of stars) {
    s.y += s.speed;
    if (s.y > height) {
      s.y = 0;
      s.x = random(width);
    }
    fill(200, 10, 90, 60);
    rect(s.x, s.y, s.size, s.size);
  }
}

function drawPaddle(x, y, hueValue) {
  // Outer glow
  push();
  fill(hueValue, 80, 80, 25);
  rect(x, y, paddleWidth * 2.2, paddleHeight * 1.2, 20);
  pop();

  // Inner solid paddle
  fill(hueValue, 60, 95);
  rect(x, y, paddleWidth, paddleHeight, 6);
}

function drawBall(ball) {
  // Glow
  fill(ball.hue, 80, 100, 40);
  ellipse(ball.x, ball.y, ball.size * 2);
  // Core
  fill(ball.hue, 90, 100, 100);
  ellipse(ball.x, ball.y, ball.size);
}


function resetBalls() {
  balls = [];
  for (let i = 0; i < numBalls; i++) {
    let dir = random([-1, 1]);
    balls.push({
      x: width / 2,
      y: height / 2,
      vx: dir * random(2.5, 3.5),
      vy: random(-2, 2),
      size: baseBallSize + i * 2,
      hue: random(0, 360)
    });
  }
}

function updateBall(ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top and bottom collisions
  if (ball.y < ball.size / 2 || ball.y > height - ball.size / 2) {
    ball.vy *= -1;
  }

  // Left paddle collision
  let leftCollisionLeft = paddleLeftX - paddleWidth / 2 - ball.size / 2;
  let leftCollisionRight = paddleLeftX + paddleWidth / 2 + ball.size / 2;
  let leftCollisionTop = paddleLeftY - paddleHeight / 2 - ball.size / 2;
  let leftCollisionBottom = paddleLeftY + paddleHeight / 2 + ball.size / 2;

  if (
    ball.x >= leftCollisionLeft &&
    ball.x <= leftCollisionRight &&
    ball.y >= leftCollisionTop &&
    ball.y <= leftCollisionBottom &&
    ball.vx < 0
  ) {
    // Reflect and speed up slightly
    ball.vx = -ball.vx * 1.05;
    ball.vy = (ball.y - paddleLeftY) * 0.12 + random(-0.5, 0.5);
    ball.hue = (ball.hue + 40) % 360;
  }

  // Right paddle collision
  let rightCollisionLeft = paddleRightX - paddleWidth / 2 - ball.size / 2;
  let rightCollisionRight = paddleRightX + paddleWidth / 2 + ball.size / 2;
  let rightCollisionTop = paddleRightY - paddleHeight / 2 - ball.size / 2;
  let rightCollisionBottom = paddleRightY + paddleHeight / 2 + ball.size / 2;

  if (
    ball.x >= rightCollisionLeft &&
    ball.x <= rightCollisionRight &&
    ball.y >= rightCollisionTop &&
    ball.y <= rightCollisionBottom &&
    ball.vx > 0
  ) {
    // Reflect and speed up slightly
    ball.vx = -ball.vx * 1.05;
    ball.vy = (ball.y - paddleRightY) * 0.12 + random(-0.5, 0.5);
    ball.hue = (ball.hue + 80) % 360;
  }

  // Scoring when ball goes off screen
  if (ball.x < -ball.size) {
    rightScore++;
    respawnBall(ball, 1); // send to the right
  } else if (ball.x > width + ball.size) {
    leftScore++;
    respawnBall(ball, -1); // send to the left
  }
}

function respawnBall(ball, direction) {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.vx = direction * random(2.5, 3.5);
  ball.vy = random(-2, 2);
  ball.hue = random(0, 360);
}



function handlePaddleInput() {
  // Gentle auto drift toward center
  let centerY = height / 2;
  paddleLeftY += (centerY - paddleLeftY) * 0.01;
  paddleRightY += (centerY - paddleRightY) * 0.01;

  // Left paddle: W / S
  let leftDownPressed = keyIsDown(83); // S
  let leftUpPressed = keyIsDown(87);   // W

  let leftMove = 0;
  if (leftDownPressed) leftMove += paddleSpeed;
  if (leftUpPressed) leftMove -= paddleSpeed;

  paddleLeftY = constrain(
    paddleLeftY + leftMove,
    paddleHeight / 2,
    height - paddleHeight / 2
  );

  // Right paddle: UP / DOWN arrows
  let rightDownPressed = keyIsDown(DOWN_ARROW);
  let rightUpPressed = keyIsDown(UP_ARROW);

  let rightMove = 0;
  if (rightDownPressed) rightMove += paddleSpeed;
  if (rightUpPressed) rightMove -= paddleSpeed;

  paddleRightY = constrain(
    paddleRightY + rightMove,
    paddleHeight / 2,
    height - paddleHeight / 2
  );
}


function mousePressed() {
  if (!isLooping()) {
    resetBalls();
    loop();
  }
}

function keyPressed() {
  // Press 'R' to reset scores + balls mid-game
  if (key === 'r' || key === 'R') {
    leftScore = 0;
    rightScore = 0;
    resetBalls();
  }
}
