const flowers = [];
let cScale;
const data_2022 = {};
let notoFont;
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
    for (let m = 1; m < 13; m++) {
      for (let i = 0; i < uniqueCode.length; i++) {
        const flower = new Flower(
          100 + (i % 5) * 150,
          100 + Math.floor(i / 5) * 150,
          data_2022[uniqueCode[i]][m],
          guCode.filter((d) => d['code'] === parseInt(uniqueCode[i]))[0][
            'nameKR'
          ]
        );
        flowers.push(flower);
      }
    }
  });
}

function setup() {
  // 캔버스 생성
  createCanvas(800, 920);
  cScale = d3.scaleDiverging(d3.interpolateRdYlBu).domain([0.45, 0.5, 0.55]);
  textAlign(CENTER);
}

function draw() {
  textFont('Noto Serif');
  noStroke();

  for (let i = 0; i < 300; i = i + 25) {
    background('#000');
    for (const f of flowers.slice(0 + i, i + 25)) {
      f.drawGrid();
      f.drawEdge();
      f.drawCenter();
      f.drawText();
    }
  }
  fill('#ccc');
  textSize(30);
  text('Seoul, 2022', 400, 880);
}

function rScale(d) {
  return d * 0.00008;
}

class Flower {
  constructor(x, y, data, gu) {
    this.x = x;
    this.y = y;
    this.data = data;
    this.color = 'fff';
    this.gu = gu;
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
      ellipse(scaledPop, 0, 4);
      pop();
    });
  }

  drawText() {
    fill('#aaa');
    textSize(13);
    const maxPop = Math.max(...this.data.map((d) => d[0] + d[1]));
    if (maxPop > 500000) {
      text(this.gu, this.x, this.y + rScale(maxPop) + 20);
    } else {
      text(this.gu, this.x, this.y + rScale(500000) + 20);
    }
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
