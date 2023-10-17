const flowers = [];
let cScale;
const data_2022 = {};

function preload() {
  // 데이터 기반의 객체 하나 만들기
  d3.csv('./data/2022_monthly.csv').then((csv) => {
    // get unique region codes
    const uniqueCode = csv
      .map((row) => row['자치구코드'])
      .filter((v, i, a) => a.indexOf(v) === i);
    const uniqueMonth = csv
      .map((row) => row['month'])
      .filter((v, i, a) => a.indexOf(v) === i);
    for (const c of uniqueCode) {
      const regionData = csv.filter((row) => row['자치구코드'] === c);
      data_2022[c] = {};
      for (const m of uniqueMonth) {
        const monthlyData = regionData.filter((row) => row['month'] === m);
        const monthlyPop = monthlyData.map((d) => {
          const { male_pop, female_pop } = d;
          const popData = [male_pop, female_pop];
          return popData.map((pop) => parseInt(pop));
        });
        data_2022[c][m] = monthlyPop;
      }
    }
    for (let i = 0; i < uniqueCode.length; i++) {
      for (let m = 1; m < 13; m++) {
        const flower = new Flower(
          0 + m * 200,
          100 + i * 300,
          data_2022[uniqueCode[i]][m]
        );
        flowers.push(flower);
      }
    }
  });
}

function setup() {
  // 캔버스 생성
  createCanvas(4200, 10000);
  cScale = d3.scaleDiverging(d3.interpolateRdYlBu).domain([0.45, 0.5, 0.55]);
  pixelDensity(2);
}

function draw() {
  background('#000');
  noLoop();
  noStroke();
  for (const f of flowers) {
    f.drawGrid();
    f.drawEdge();
    f.drawCenter();
  }
}

function rScale(d) {
  return d * 0.00015;
}

function drawPoint(x, y, r) {
  ellipse(x, y, r);
}

// 두 개의 좌표 사이에 점을 계속해서 찍어 나가는 함수
function drawLine(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a + (3 / 4) * TWO_PI) * radius;
    let sy = y + sin(a + (3 / 4) * TWO_PI) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

class Flower {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.data = data;
    this.color = 'fff';
  }

  drawCenter(){
    noStroke();
    const femaleAvg =
      this.data.map((d) => d[1]).reduce((d, acc) => d + acc, 0) / 24;
    const maleAvg =
      this.data.map((d) => d[0]).reduce((d, acc) => d + acc, 0) / 24;
    this.color = cScale(maleAvg / (femaleAvg + maleAvg));
    fill('#000');
    ellipse(this.x, this.y, 25);
    fill('#fff');
    const randValue = Math.random();
    if (randValue > 0.7) {
      polygon(this.x, this.y, 10, 4);
    }
    if (randValue <= 0.7 && randValue > 0.3) {
      polygon(this.x, this.y, 10, 4);
    } else {
      ellipse(this.x, this.y, 20);
    }
  }

  drawGrid() {
    stroke('#636363');
    drawingContext.setLineDash([3, 3]);
    noFill();
    ellipse(this.x, this.y, rScale(1000000));
    ellipse(this.x, this.y, rScale(500000));
    stroke('#424242');
  }

  drawEdge() {
    // edge of the circle
    stroke('#ccc');
    drawingContext.setLineDash([]);
    noFill();
    let totalPop = this.data[0][0] + this.data[0][1];
    let prevEdgeX = this.x + rScale(totalPop) * Math.cos(-Math.PI / 2);
    let prevEdgeY = this.y + rScale(totalPop) * Math.sin(-Math.PI / 2);
    [...this.data, this.data[0]].forEach((d, i) => {
      const angle = ((2 * Math.PI) / 24) * i - Math.PI / 2;
      totalPop = d[0] + d[1];
      const edgeX = this.x + rScale(totalPop) * Math.cos(angle);
      const edgeY = this.y + rScale(totalPop) * Math.sin(angle);
      line(prevEdgeX, prevEdgeY, edgeX, edgeY);
      prevEdgeX = edgeX;
      prevEdgeY = edgeY;
    });

    // petals
    this.data.forEach((d, i) => {
      const angle = ((2 * Math.PI) / 24) * i - Math.PI / 2;
      push();
      noStroke();
      translate(this.x, this.y);
      rotate(angle);
      const scaledPop = rScale(d[0] + d[1]);
      const mRatio = d[0] / (d[0] + d[1]);
      fill('#424242');
      drawLine(0, 0, scaledPop, 0);
      fill(cScale(mRatio));
      stroke(cScale(mRatio))
      if ([4, 9, 12, 15, 19, 23].includes(i)) {
        drawPetal(scaledPop, 5);
        drawPetal(scaledPop, -5);
      }
      drawPoint(scaledPop, 0, 4);
      pop();
    });
  }
}

function drawPetal(endX, height) {
  beginShape();
  for (let i = 0; i < endX; i++) {
    const yPos = height * Math.sin(((Math.PI * 1) / endX) * i);
    vertex(i, yPos);
  }
  endShape();
}
