// eslint-disable-next-line import/extensions
import armClass from './src/arm.js';

const canvasW = 512;
const canvasH = 512;

const arms = [];
const nArms = 8;

let learning = true;

const armPlacementRadius = 100;

function setup() {
  createCanvas(canvasW, canvasH);

  for (let i = 0; i < nArms; i += 1) {
    const angle = i * (TWO_PI / nArms);
    const x = cos(angle) * armPlacementRadius;
    const y = sin(angle) * armPlacementRadius;

    const arm = new armClass.Arm(
      x,
      y,
      [50, 30, 5],
      [8, 4, 2],
    );

    arms.push(arm);
  }
}

function draw() {
  if (frameCount > 1000) {
    learning = false;
  }

  if (!learning) {
    background(200);
  }
  translate(width / 2, height / 2);

  noStroke();
  fill(noise(frameCount * 0.001) * 150);
  ellipse(0, 0, armPlacementRadius * 2);

  arms.forEach((arm) => {
    if (learning) {
      arm.updateRandom();
    } else {
      arm.updateGoal(mouseX - width / 2, mouseY - height / 2);
    }
    arm.draw();
  });
}

window.setup = setup;
window.draw = draw;
