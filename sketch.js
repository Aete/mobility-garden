const flowers = [];
let cScale;
const data = {};
const uniqueYear = ['2019', '2020'];
let uniqueMonth;

const xSpace = 200;
const ySpace = 270;

function preload() {
  // 데이터 기반의 객체 하나 만들기
  d3.csv('./data/living_pop.csv').then((csv) => {
    // get unique region codes
    const uniqueCode = csv
      .map((row) => row['자치구코드'])
      .filter((v, i, a) => a.indexOf(v) === i);
    uniqueMonth = csv
      .map((row) => row['month'])
      .filter((v, i, a) => a.indexOf(v) === i);
    for (const c of uniqueCode) {
      const regionData = csv.filter((row) => row['자치구코드'] === c);
      data[c] = {};
      for (const y of uniqueYear) {
        data[c][y] = {};
        const annualData = regionData.filter((row) => row['year'] === y);
        for (const m of uniqueMonth) {
          const monthlyData = annualData.filter((row) => row['month'] === m);
          const sortedData = monthlyData.sort(
            (a, b) => parseInt(a['시간대구분']) - parseInt(b['시간대구분'])
          );

          const monthlyPop = sortedData.map((d) => {
            const { male_pop, female_pop } = d;
            const popData = [male_pop, female_pop];
            return popData.map((pop) => parseInt(pop));
          });
          data[c][y][m] = monthlyPop;
        }
      }
    }
    console.log(data);
    for (let i = 0; i < uniqueCode.length; i++) {
      for (let a = 0; a < 2; a++) {
        for (let m = 1; m < 13; m++) {
          const flower = new Flower(
            m * xSpace + a * xSpace * 12,
            300 + i * ySpace,
            data[uniqueCode[i]][uniqueYear[a]][m]
          );
          flowers.push(flower);
        }
      }
    }
  });
}

function setup() {
  // 캔버스 생성
  createCanvas(5000, 7000);
  cScale = d3.scaleDiverging(d3.interpolateRdYlBu).domain([0.45, 0.5, 0.55]);
  pixelDensity(1);
  textAlign(CENTER);
}

function draw() {
  background('#000');

  createMonthGrid();
  noLoop();
  noStroke();
  for (const f of flowers) {
    f.drawGrid();
    f.drawEdge();
    f.drawCenter();
  }
}

function createMonthGrid() {
  for (let a = 0; a < 2; a++) {
    for (let m = 1; m < 13; m++) {
      const xPos = m * xSpace + a * xSpace * 12;
      stroke('#333');
      drawLine(xPos, 150, xPos, 6900);
      noStroke();
      fill('#aaa');
      textSize(25);
      text(`${uniqueYear[a]}.${m > 9 ? m : '0' + m}`, xPos, 120);
    }
  }
}

function createGuGrid(index) {
  const yPos = month * 180;
  stroke('#424242');
  drawLine(100, yPos, 2600, yPos);
}

function rScale(d) {
  return d * 0.0001;
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

  drawCenter() {
    noStroke();
    fill('#fff');
    ellipse(this.x, this.y, 8);
  }

  drawGrid() {
    stroke('#636363');
    drawingContext.setLineDash([3, 3]);
    noFill();
    ellipse(this.x, this.y, rScale(500000) * 2);
    ellipse(this.x, this.y, rScale(250000) * 2);
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
      const scaledPop = rScale(d[0] + d[1]);
      const mRatio = d[0] / (d[0] + d[1]);
      const scaledColor = color(cScale(mRatio));
      scaledColor.setAlpha(180);
      push();
      translate(this.x, this.y);
      rotate(angle);
      fill(scaledColor);
      noStroke();
      if ([0, 4, 9, 15, 20].includes(i)) {
        drawPetal(scaledPop, scaledPop * 0.125);
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
  beginShape();
  for (let i = 0; i < endX; i++) {
    const yPos = height * Math.sin(((Math.PI * 1) / endX) * i);
    vertex(i, -yPos);
  }
  endShape();
}
