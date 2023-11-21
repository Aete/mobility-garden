const flowers = [];
let cScale;
const data = {};
const uniqueYear = ['2021', '2022'];
let uniqueMonth;
let uniqueCode;

const guCode = [
  { code: 11110, nameKR: 'Jongno-gu' },
  { code: 11140, nameKR: 'Jung-gu' },
  { code: 11170, nameKR: 'Yongsan-gu' },
  { code: 11200, nameKR: 'Seongdong-gu' },
  { code: 11215, nameKR: 'Gwangjin-gu' },
  { code: 11230, nameKR: 'Dongdaemun-gu' },
  { code: 11260, nameKR: 'Jungnang-gu' },
  { code: 11290, nameKR: 'Seongbuk-gu' },
  { code: 11305, nameKR: 'Gangbuk-gu' },
  { code: 11320, nameKR: 'Dobong-gu' },
  { code: 11350, nameKR: 'Nowon-gu' },
  { code: 11380, nameKR: 'Eunpyeong-gu' },
  { code: 11410, nameKR: 'Seodaemun-gu' },
  { code: 11440, nameKR: 'Mapo-gu' },
  { code: 11470, nameKR: 'Yangcheon-gu' },
  { code: 11500, nameKR: 'Gangseo-gu' },
  { code: 11530, nameKR: 'Guro-gu' },
  { code: 11545, nameKR: 'Geumcheon-gu' },
  { code: 11560, nameKR: 'Yeongdeungpo-gu' },
  { code: 11590, nameKR: 'Dongjak-gu' },
  { code: 11620, nameKR: 'Gwanak-gu' },
  { code: 11650, nameKR: 'Seocho-gu' },
  { code: 11680, nameKR: 'Gangnam-gu' },
  { code: 11740, nameKR: 'Gangdong-gu' },
  { code: 11710, nameKR: 'Songpa-gu' },
];

const monthArray = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

const xSpace = 160;
const ySpace = 250;

function setXPos(a, m) {
  return m * xSpace + a * xSpace * 12;
}

function setYPos(i) {
  return 500 + i * ySpace;
}

async function getData() {
  // 데이터 기반의 객체 하나 만들기
  await d3.csv('./data/living_pop.csv').then((csv) => {
    // get unique region codes
    uniqueCode = csv
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
    for (let i = 0; i < uniqueCode.length; i++) {
      for (let a = 0; a < 2; a++) {
        for (let m = 1; m < 13; m++) {
          const flower = new Flower(
            setXPos(a, m),
            setYPos(i),
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
  createCanvas(5500, 7000);
  cScale = d3.scaleDiverging(d3.interpolateRdYlBu).domain([0.45, 0.5, 0.55]);
  pixelDensity(2);
  background('#212121');
}

async function draw() {
  noLoop();
  await getData();
  createMonthGrid();
  createGuGrid();

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
      const xPos = setXPos(a, m);
      stroke('#636363');
      drawLine(xPos, 370, xPos, 6650);
      noStroke();
      fill('#ccc');
      textSize(70);
      textAlign(CENTER);
      text(monthArray[m - 1], xPos, 320);
      text(monthArray[m - 1], xPos, 6700);
    }
  }
}

function createGuGrid() {
  for (let i = 0; i < uniqueCode.length; i++) {
    const yPos = setYPos(i);
    stroke('#636363');
    drawLine(0, yPos, 4000, yPos);
    textSize(90);
    textAlign(LEFT);
    text(
      `${
        guCode.filter((d) => d['code'] === parseInt(uniqueCode[i]))[0]['nameKR']
      }`,
      4050,
      yPos + 40
    );
  }
}

function rScale(d) {
  return d * 0.00008;
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
