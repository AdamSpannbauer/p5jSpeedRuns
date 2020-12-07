const canvasW = 512;
const canvasH = 512;

const myLines = [];
const nLines = 30;
const radius1 = 200;
const radius2 = canvasW * 2;

class Line {
  constructor(r1, r2) {
    // Radii of inner/outer circles
    this.r1 = r1;
    this.r2 = r2;

    // Angle (to be random) on inner/outer circles
    // Values set in update
    this.a1 = 0;
    this.a2 = 0;
    this.color = 0;
    this.alpha = 0;
    this.weight = 0;

    this.noiseSeedA1 = random(100);
    this.noiseSeedA2 = random(100);
    this.noiseSeedAppearance = random(100);
    this.noiseStep = 0.0005;

    this.update();
  }

  update() {
    // noise range: [0, 1]
    // desired range: [0, TWO_PI * 2] (radians)
    // [0, 1] * TWO_PI -> [0, TWO_PI]

    const randA1 = 2 * TWO_PI * noise(this.noiseSeedA1);
    const randA2 = 2 * TWO_PI * noise(this.noiseSeedA2);
    const randAppear = noise(this.noiseSeedAppearance);

    this.noiseSeedA1 += this.noiseStep;
    this.noiseSeedA2 += this.noiseStep;
    this.noiseSeedAppearance += this.noiseStep;

    this.a1 = randA1;
    this.a2 = randA2;
    this.color = map(randAppear, 0, 1, 50, 255);
    this.alpha = map(randAppear, 0, 1, 50, 200);
    this.weight = map(randAppear, 0, 1, 1, 5);
  }

  draw() {
    push();

    stroke(this.color, this.alpha);
    strokeWeight(this.weight);

    // Assume circle centers are at (0, 0)
    // SOH CAH TOA
    const x1 = cos(this.a1) * this.r1;
    const y1 = sin(this.a1) * this.r1;

    const x2 = cos(this.a2) * this.r2;
    const y2 = sin(this.a2) * this.r2;

    line(x1, y1, x2, y2);
    pop();
  }
}

function setup() {
  createCanvas(canvasW, canvasH);

  let myLine;
  for (let i = 0; i < nLines; i += 1) {
    myLine = new Line(radius1, radius2);
    myLines.push(myLine);
  }
}

function draw() {
  background(30);
  background(30, 25, 145, 10);
  translate(width / 2, height / 2);

  // Draw all rand angle lines
  myLines.forEach((x) => {
    x.update();
    x.draw();
  });

  // Draw a inner circle as transparent
  // overlay over the lines
  fill(30, 25, 145, 30);
  noStroke();
  ellipse(0, 0, radius1 * 2);
}

window.setup = setup;
window.draw = draw;
