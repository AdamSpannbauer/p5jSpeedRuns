class ArmSegment {
  constructor(x1, y1, radius, strokeWeight) {
    this.x1 = x1;
    this.y1 = y1;
    this.radius = radius;
    this.strokeWeight = strokeWeight;

    this.angleSeed = random(100);
    this.angleSeedStep = 0.01;

    this.angle = 0.0;
    this.x2 = 0.0;
    this.y2 = 0.0;

    this.update();
  }

  updateRandom() {
    this.angle = noise(this.angleSeed) * TWO_PI * 2;
    this.angleSeed += this.angleSeedStep;
    this.update();
  }

  update() {
    this.x2 = cos(this.angle) * this.radius + this.x1;
    this.y2 = sin(this.angle) * this.radius + this.y1;
  }

  draw() {
    push();
    stroke(0);
    strokeWeight(this.strokeWeight);
    line(this.x1, this.y1, this.x2, this.y2);
    pop();
  }
}

export default { ArmSegment };
