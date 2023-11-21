let cScale;
const data = {};
const windowWidth = 1024;
const windowHeight = 1366;

let year = 2019;
let month = 11;

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
    const flower = flowers[c][[uniqueYear[0]]][month];
    flower.drawEdge();
    flower.drawCenter();
  }
  fill('#ccc');
  textSize(60);
  text(
    `Seoul, ${monthArray[month - 1]} ${year}`,
    windowWidth / 2,
    windowHeight - 200
  );
  if (month === 12) {
    year = year === 2022 ? 2019 : year + 1;
    month = 1;
  } else {
    month += 1;
  }
}
