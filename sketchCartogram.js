const flowers = {};
let cScale;
const data_2022 = {};
let notoFont;
const windowWidth = 910;
const windowHeight = 1170;
let month = 1;

const guCode = [
  { code: 11110, nameKR: 'Jongno-gu', x: 126.9773213,  y: 37.59491732},
  { code: 11140, nameKR: 'Jung-gu' , x: 126.9959681,  y: 37.56014356},
  { code: 11170, nameKR: 'Yongsan-gu' , x: 126.979907,  y: 37.53138497},
  { code: 11200, nameKR: 'Seongdong-gu' , x: 127.0410585,  y: 37.55102969},
  { code: 11215, nameKR: 'Gwangjin-gu' , x: 127.0857435,  y: 37.54670608},
  { code: 11230, nameKR: 'Dongdaemun-gu' , x: 127.0548481,  y: 37.58195655},
  { code: 11260, nameKR: 'Jungnang-gu' , x: 127.0928803,  y: 37.59780259},
  { code: 11290, nameKR: 'Seongbuk-gu' , x: 127.017579,  y: 	37.6057019},
  { code: 11305, nameKR: 'Gangbuk-gu' , x: 127.011189,  y: 37.64347391},
  { code: 11320, nameKR: 'Dobong-gu' , x: 127.0323688,  y: 37.66910208},
  { code: 11350, nameKR: 'Nowon-gu' , x: 127.0750347,  y: 37.65251105},
  { code: 11380, nameKR: 'Eunpyeong-gu' , x: 126.9270229,  y: 37.61921128},
  { code: 11410, nameKR: 'Seodaemun-gu' , x: 126.9390631,  y: 37.57778531},
  { code: 11440, nameKR: 'Mapo-gu' , x: 126.90827,  y: 37.55931349},
  { code: 11470, nameKR: 'Yangcheon-gu' , x: 126.8554777,  y: 37.52478941},
  { code: 11500, nameKR: 'Gangseo-gu' , x: 126.822807,  y: 37.56123543},
  { code: 11530, nameKR: 'Guro-gu' , x: 126.8563006,  y: 37.49440543},
  { code: 11545, nameKR: 'Geumcheon-gu' , x: 126.9008202,  y: 37.46056756},
  { code: 11560, nameKR: 'Yeongdeungpo-gu' , x: 126.9101695,  y: 37.52230829},
  { code: 11590, nameKR: 'Dongjak-gu' , x: 126.9516415,  y: 37.49887688},
  { code: 11620, nameKR: 'Gwanak-gu' , x: 126.9453372,  y: 37.46737569},
  { code: 11650, nameKR: 'Seocho-gu' , x: 127.0312203,  y: 37.47329547},
  { code: 11680, nameKR: 'Gangnam-gu' , x: 127.0629852,  y: 37.49664389},
  { code: 11740, nameKR: 'Gangdong-gu' , x: 127.115295,  y: 37.50561924},
  { code: 11710, nameKR: 'Songpa-gu' , x: 127.1470118,  y: 37.55045024},
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

const uniqueCode = guCode.map((d) => d.code);

function preload() {
  // 데이터 기반의 객체 하나 만들기
  d3.csv('./data/2022_monthly.csv').then((csv) => {
    const uniqueMonth = csv
      .map((row) => row['month'])
      .filter((v, i, a) => a.indexOf(v) === i);
    for (const c of uniqueCode) {
      const regionData = csv.filter((row) => parseInt(row['자치구코드']) === c);
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
    const projection = d3.geoMercator().center([126.9895, 37.5651])
                          .scale(110000)
                          .translate([windowWidth/2, windowHeight/2-50]);
    
    for (let m = 1; m < 13; m++) {
      flowers[m] = {};
      for (let i = 0; i < uniqueCode.length; i++) {
        const gu = guCode.filter(d=>d.code === parseInt(uniqueCode[i]))[0]
        const coord = projection([gu.x, gu.y])
        const flower = new Flower(
          coord[0],
          coord[1],
          data_2022[uniqueCode[i]][m],
          gu['nameKR']
        );
        flowers[m][uniqueCode[i]] = flower;
      }
    }
  });
}

function setup() {
  // 캔버스 생성
  createCanvas(windowWidth, windowHeight);
  cScale = d3.scaleDiverging(d3.interpolateRdYlBu).domain([0.45, 0.5, 0.55]);
  textAlign(CENTER);
  frameRate(1.5);
  textFont('Lato');
}

function draw() {
  background('#212121');
  noStroke();
  for (const c of uniqueCode) {
    const flower = flowers[month][c];
    flower.drawEdge();
    flower.drawCenter();
  }
  fill('#ccc');
  textSize(35);
  text(
    `Seoul, ${monthArray[month - 1]} 2022`,
    windowWidth / 2,
    windowHeight - 40
  );
  month = month === 12 ? 1 : month + 1;
}

function rScale(d) {
  return d * 0.00010;
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
