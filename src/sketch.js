const width = 1200;
const height = 600;
const centerX = width / 2;
const centerY = height / 2;
let starting_noise = 0;

const dataset = [];

const flowers = [];

function setup() {
  // 캔버스 생성
  createCanvas(width, height);

  // 임시 데이터 생성 => 향후 서울시 생활이동 데이터 불러와서 작성할 계획
  for (let i of Array(5)) {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push(Math.random() * (150 - 100) + 100);
    }
    dataset.push(data);
  }

  // 데이터 기반의 객체 하나 만들기
  for (let i = 0; i < dataset.length; i++) {
    // 우선은 x, y값 임의로 생성
    const flower = new Flower(i * 300 + 150, 200, dataset[i]);
    flowers.push(flower);
  }
}

function draw() {
  background(255);
  noLoop();
  noStroke();
  for (const f of flowers) {
    f.drawEdge();
    f.drawCenter();
  }
}

function rScale(d) {
  return d * 0.8;
}

function drawPoint(x, y, r) {
  ellipse(x, y, r);
}

// 두 개의 좌표 사이에 점을 계속해서 찍어 나가는 함수
function drawLine(x1, y1, x2, y2) {
  let length = dist(x1, y1, x2, y2);

  // s값은 canvasSize/900 === width / 700 === height/900
  for (let i = 0; i < length; i += 0.7) {
    let x = lerp(x1, x2, i / length);
    let y = lerp(y1, y2, i / length);
    starting_noise += 0.03;
    const noiseVal = noise(starting_noise) / 2;
    drawPoint(x + noiseVal * 2, y + noiseVal * 2, noiseVal + 0.8);
  }
}

class Flower {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.data = data;
  }

  drawCenter() {
    fill('#263238');
    drawPoint(this.x, this.y, 18);
  }

  drawEdge() {
    // 데이터를 따라서 원 배열
    noStroke();
    this.data.forEach((d, i) => {
      const angle = ((2 * Math.PI) / 24) * i;
      const edgeX = this.x + rScale(d * Math.cos(angle));
      const edgeY = this.y + rScale(d * Math.sin(angle));
      fill('rgba(38,50,56,0.2)');
      drawLine(this.x, this.y, edgeX, edgeY);
      fill('#455a64');
      drawPoint(edgeX, edgeY, Math.sqrt(d) * 0.8);
    });

    stroke('rgba(38,50,56,0.2)');
    noFill();
    beginShape();
    this.data.forEach((d, i) => {
      const angle = ((2 * Math.PI) / 24) * i;
      const edgeX = this.x + rScale(d * Math.cos(angle));
      const edgeY = this.y + rScale(d * Math.sin(angle));
      curveVertex(edgeX, edgeY);
      console.log(edgeX, edgeY, angle, i);
    });
    const angle = ((2 * Math.PI) / 24) * 24;
    const edgeX = this.x + rScale(this.data[0] * Math.cos(angle));
    const edgeY = this.y + rScale(this.data[0] * Math.sin(angle));
    curveVertex(edgeX, edgeY);
    endShape();
  }
}
