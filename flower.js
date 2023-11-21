const flowers = {};

class Flower {
  constructor(x, y, data, gu, rRatio) {
    this.x = x;
    this.y = y;
    this.data = data;
    this.color = 'fff';
    this.gu = gu;
    this.rRatio = 0.0001;
  }

  rScale(d) {
    return d * this.rRatio;
  }

  drawCenter() {
    noStroke();
    fill('#fff');
    ellipse(this.x, this.y, 8);
  }

  drawGrid() {
    stroke('#636363');
    drawingContext.setLineDash([3, 3]);
    noFill();
    ellipse(this.x, this.y, this.rScale(500000) * 2);
    ellipse(this.x, this.y, this.rScale(250000) * 2);
  }

  drawEdge() {
    // edge of the circle
    stroke('#ccc');
    drawingContext.setLineDash([]);
    noFill();
    let totalPop = this.data[0][0] + this.data[0][1];
    let prevEdgeX = this.x + this.rScale(totalPop) * Math.cos(-Math.PI / 2);
    let prevEdgeY = this.y + this.rScale(totalPop) * Math.sin(-Math.PI / 2);
    [...this.data, this.data[0]].forEach((d, i) => {
      const angle = ((2 * Math.PI) / 24) * i - Math.PI / 2;
      totalPop = d[0] + d[1];
      const edgeX = this.x + this.rScale(totalPop) * Math.cos(angle);
      const edgeY = this.y + this.rScale(totalPop) * Math.sin(angle);
      line(prevEdgeX, prevEdgeY, edgeX, edgeY);
      prevEdgeX = edgeX;
      prevEdgeY = edgeY;
    });

    // petals
    this.data.forEach((d, i) => {
      const angle = ((2 * Math.PI) / 24) * i - Math.PI / 2;
      const scaledPop = this.rScale(d[0] + d[1]);
      const mRatio = d[0] / (d[0] + d[1]);
      const scaledColor = color(cScale(mRatio));
      scaledColor.setAlpha(180);
      push();
      translate(this.x, this.y);
      rotate(angle);
      fill(scaledColor);
      noStroke();
      if ([0, 4, 9, 15, 20].includes(i)) {
        this.drawPetal(scaledPop, scaledPop * 0.125);
      }
      ellipse(scaledPop, 0, 4);
      pop();
    });
  }

  drawText() {
    fill('#aaa');
    textSize(13);
    const maxPop = Math.max(...this.data.map((d) => d[0] + d[1]));
    if (maxPop > 500000) {
      text(this.gu, this.x, this.y + this.rScale(maxPop) + 20);
    } else {
      text(this.gu, this.x, this.y + this.rScale(500000) + 20);
    }
  }

  drawPetal(endX, height) {
    beginShape();
    for (let i = 0; i < endX; i++) {
      const yPos = height * Math.sin(((Math.PI * 1) / endX) * i);
      vertex(i, yPos);
    }
    endShape();
    beginShape();
    for (let i = 0; i < endX; i++) {
      const yPos = height * Math.sin(((Math.PI * 1) / endX) * i);
      vertex(i, -yPos);
    }
    endShape();
  }
}
