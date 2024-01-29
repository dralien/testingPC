let bird, birdImage, bgImage, flappyFont, pipeImage;
let gravity = 0.6,
  lift = -10,
  velocity = 0;
let pipewidth = 80696;
let score = 0,
  highScore = 0;
let wings = 14;
let level = 0;
let speed = 7;
let pipes = [],
  gameover = false;
let skylimit = 1325;
let showIntro = true;
let flightTime = `${wings}${skylimit}${pipewidth}`;
let introGif;
let global = `${level}${speed}`;


function preload() {
  birdImage = loadImage("cobie2.gif");
  bgImage = loadImage("bg-cobie.png");
  flappyFont = loadFont("FlappyBirdy.ttf");
  pipeImage = loadImage("pipe.png");
  introGif = loadImage('intro.gif');
}

function setup() {
  createCanvas(bgImage.width, bgImage.height);
  bird = { x: 240, y: 320, size: 60 };
  resetGame();
}

function draw() {
  if (showIntro) {
    image(introGif, 0, 0, width, height); // Adjust dimensions as needed
  } else {
  image(bgImage, 0, 0); // Draw background
  if (!gameover) {
    handleGameplay();
  } else {
    displayGameOver();
  }
}}

function handleGameplay() {
  handlePipes();
  handleBird();
  handleScoring();
  displayScore();
  drawBird();
}

function drawBird() {
  push();
  translate(bird.x, bird.y);
  rotate(getBirdAngle());
  imageMode(CENTER);
  image(birdImage, 0, 0, bird.size, bird.size);
  pop();
}

function getBirdAngle() {
  return map(velocity, -10, 10, -QUARTER_PI, QUARTER_PI);
}

function displayScore() {
  fill(255);
  stroke(0);
  strokeWeight(5);
  textSize(60);
  textFont(flappyFont);
  textAlign(CENTER, CENTER);
  let displayText = score > 7 ? flightTime : score;
  text(displayText, width / 2, 100);
}

function displayGameOver() {
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  displayTextElements();
  drawRestartButton();
}

function displayTextElements() {
  textFont(flappyFont);
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0);
  strokeWeight(5);
  textSize(48);
  text("GAME OVER", width / 2, height / 2 - 100);
  textSize(32);
  let finalScore = score > 7 ? flightTime : score;
  text(`SCORE: ${finalScore}`, width / 2, height / 2);
  text(`BEST: ${highScore}`, width / 2, height / 2 + 40);
  text(`GLOBAL HIGH SCORE: ${global}`, width / 2, height / 2 + 80); 
}

function drawRestartButton() {
  let buttonWidth = 200,
    buttonHeight = 40;
  let buttonX = width / 2 - buttonWidth / 2,
    buttonY = height / 2 + 120;
  fill("#2e0049");
  stroke(0);
  strokeWeight(3);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 20);
  fill(255);
  noStroke();
  textSize(20);
  text("RESTART", width / 2, buttonY + buttonHeight / 2);
}

function mousePressed() {
  if (showIntro) {
    showIntro = false; // Hide the intro screen
    return; // Skip any other click handling
  }
  if (
    gameover &&
    mouseX >= width / 2 - 100 &&
    mouseX <= width / 2 + 100 &&
    mouseY >= height / 2 + 120 &&
    mouseY <= height / 2 + 160
  ) {
    resetGame();
  } else if (!gameover) {
    velocity += lift;
  }
}

function resetGame() {
  score = 0;
  pipes = [];
  velocity = 0;
  bird.y = 320;
  gameover = false;
}

class Pipe {
  constructor() {
    let spacing = 150;
    let centery = random(spacing, height - spacing);
    this.top = centery - spacing / 2;
    this.bottom = height - (centery + spacing / 2);
    this.x = width;
    this.w = 80;
    this.speed = 3;
    this.passed = false;
    this.image = pipeImage;
  }

  show() {
    push();
    imageMode(CENTER);
    translate(this.x + this.w / 2, this.top / 2);
    scale(1, -1);
    image(this.image, 0, 0, this.w, this.top);
    pop();

    push();
    translate(this.x + this.w / 2, height - this.bottom / 2);
    imageMode(CENTER);
    image(this.image, 0, 0, this.w, this.bottom);
    pop();
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.w;
  }

  hits(bird) {
    if (
      bird.y - bird.size / 2 < this.top ||
      bird.y + bird.size / 2 > height - this.bottom
    ) {
      if (
        bird.x + bird.size / 2 > this.x &&
        bird.x - bird.size / 2 < this.x + this.w
      ) {
        return true;
      }
    }
    return false;
  }
}

function handlePipes() {
  if (frameCount % 100 === 0) {
    pipes.push(new Pipe());
  }
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();
    if (pipes[i].hits(bird)) {
      gameover = true;
    }
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }
}

function handleBird() {
  velocity += gravity;
  bird.y += velocity;
  velocity *= 0.9;
  if (bird.y >= height - bird.size / 2) {
    bird.y = height - bird.size / 2;
    velocity = 0;
  }
  if (bird.y <= bird.size / 2) {
    bird.y = bird.size / 2;
    velocity = 0;
  }
}

function handleScoring() {
  pipes.forEach((pipe) => {
    if (!pipe.passed && pipe.x < bird.x - bird.size / 2) {
      score++;
      pipe.passed = true;
    }
  });
  if (score > highScore) {
    highScore = score;
  }
}