// eslint-disable-next-line import/extensions
import armSeg from './armSegment.js';

const myRound = (x, nDec) => {
  const scl = 10 ** nDec;
  return Math.round(x * scl) / scl;
};

const sqDist = (x1, y1, x2, y2) => (x1 - x2) ** 2 + (y1 - y2) ** 2;

const posKNN = (x, y, memory, k = 1) => {
  // eslint-disable-next-line no-unused-vars
  const sqDists = Object.entries(memory).map(([key, { angles, pos }]) => ({
    pos,
    angles,
    sqDist: sqDist(x, y, pos.x, pos.y),
  }));
  sqDists.sort((a, b) => a.sqDist - b.sqDist);

  return sqDists.slice(0, k);
};

class Arm {
  constructor(x1, y1, lengths, strokeWeights) {
    this.memory = {};
    this.armSegs = [];

    for (let i = 0; i < lengths.length; i += 1) {
      if (i === 0) {
        this.armSegs.push(new armSeg.ArmSegment(x1, y1, lengths[i], strokeWeights[i]));
      } else {
        const { x2, y2 } = this.armSegs[i - 1];
        this.armSegs.push(new armSeg.ArmSegment(x2, y2, lengths[i], strokeWeights[i]));
      }
    }
  }

  saveState() {
    const prec = -1;
    const lastSeg = this.armSegs[this.armSegs.length - 1];
    const pos = {
      x: myRound(lastSeg.x2, prec),
      y: myRound(lastSeg.y2, prec),
    };
    const key = `${pos.x},${pos.y}`;

    const state = {
      angles: this.armSegs.map((seg) => seg.angle),
      pos: { x: lastSeg.x2, y: lastSeg.y2 },
    };

    this.memory[key] = state;
  }

  updateGoal(x, y) {
    const [closestMemory] = posKNN(x, y, this.memory);
    for (let i = 0; i < this.armSegs.length; i += 1) {
      this.armSegs[i].angle = closestMemory.angles[i];
      if (i > 0) {
        const { x2, y2 } = this.armSegs[i - 1];
        this.armSegs[i].x1 = x2;
        this.armSegs[i].y1 = y2;
      }

      this.armSegs[i].update();
    }
    this.saveState();
  }

  updateRandom() {
    this.armSegs.forEach((seg, i) => {
      let prevSeg;
      if (i > 0) {
        prevSeg = this.armSegs[i - 1];
        // eslint-disable-next-line no-param-reassign
        seg.x1 = prevSeg.x2;
        // eslint-disable-next-line no-param-reassign
        seg.y1 = prevSeg.y2;
      }
      seg.updateRandom();
    });

    this.saveState();
  }

  draw() {
    this.armSegs.forEach((seg) => {
      seg.draw();
    });
  }
}

export default { Arm };
