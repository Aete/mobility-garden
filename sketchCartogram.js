let cScale;
const data = {};
const windowWidth = 1024;
const windowHeight = 1366;

let year = 2019;
let month = 1;
let button;
let playMode = true;

let yearSelect;
let monthSelect;

function setup() {
  // 캔버스 생성
  createCanvas(windowWidth, windowHeight);
  cScale = d3.scaleDiverging(d3.interpolateRdYlBu).domain([0.45, 0.5, 0.55]);
  textAlign(CENTER);
  frameRate(1.5);
  textFont('Lato');
  createPlayButton();
  createYearMenu();
  createMonthMenu();
}

function draw() {
  noStroke();
  yearSelect.selected(year);
  monthSelect.selected(month);
  updateFlowers();
  fill('#ccc');
  textSize(60);
  text(
    `Seoul, ${monthArray[month - 1]} ${year}`,
    windowWidth / 2,
    windowHeight - 200
  );
  if (playMode === true) {
    if (month === 12) {
      year = year === 2022 ? 2019 : year + 1;
      month = 1;
    } else {
      month += 1;
    }
  }
}

function createPlayButton() {
  button = createButton('⏸');
  button.position(50, 50);
  button.style('font-size', '60px');
  button.style('height', '80px');
  button.style('width', '80px');
  button.style('line-height', '40px');
  button.style('background', '#fff');
  button.style('border-radius', '40px');

  button.mousePressed(toggleButton);
}

function toggleButton() {
  if (playMode !== true) {
    playMode = true;
    button.html('⏸');
  } else {
    playMode = false;
    button.html('⏵');
  }
}

function createYearMenu() {
  yearSelect = createSelect();
  yearSelect.position(200, 50);
  yearSelect.style('font-size', '30px');
  yearSelect.style('padding-left', '20px');
  yearSelect.style('height', '80px');
  yearSelect.style('width', '150px');
  yearSelect.style('line-height', '40px');
  yearSelect.style('background', '#fff');
  yearSelect.style('border-radius', '40px');
  yearSelect.option(2019);
  yearSelect.option(2020);
  yearSelect.option(2021);
  yearSelect.option(2022);
  yearSelect.selected(year);
  yearSelect.changed(yearChanged);
}

function yearChanged() {
  year = yearSelect.value();
  updateFlowers();
}

function createMonthMenu() {
  monthSelect = createSelect();
  monthSelect.position(400, 50);
  monthSelect.style('font-size', '30px');
  monthSelect.style('padding-left', '20px');
  monthSelect.style('height', '80px');
  monthSelect.style('width', '150px');
  monthSelect.style('line-height', '40px');
  monthSelect.style('background', '#fff');
  monthSelect.style('border-radius', '40px');
  monthSelect.option(1);
  monthSelect.option(2);
  monthSelect.option(3);
  monthSelect.option(4);
  monthSelect.option(5);
  monthSelect.option(6);
  monthSelect.option(7);
  monthSelect.option(8);
  monthSelect.option(9);
  monthSelect.option(10);
  monthSelect.option(11);
  monthSelect.option(12);
  monthSelect.selected(month);
  monthSelect.changed(monthChanged);
}

function monthChanged() {
  month = monthSelect.value();
  updateFlowers();
}
