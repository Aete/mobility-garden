let cScale;
const data = {};
const windowWidth = 1024;
const windowHeight = 1366;

let year = 2019;
let month = 1;
let button;
let playMode = true;
let mode = 'Geography';

let yearSelect;
let monthSelect;
let modeSelect;

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
  createModeMenu();
}

function draw() {
  noStroke();
  yearSelect.selected(year);
  monthSelect.selected(month);
  background('#212121');
  visualizeText();
  updateFlowers(mode);
}

function visualizeText() {
  fill('#fff');
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
  button = createButton('Stop');
  button.position(125, 30);
  button.style('font-size', '20px');
  button.style('color','#212121');
  button.style('height', '40px');
  button.style('width', '80px');
  button.style('line-height', '20px');
  button.style('background', '#fff');
  button.style('border-radius', '40px');

  button.mousePressed(toggleButton);
}

function toggleButton() {
  if (playMode !== true) {
    playMode = true;
    button.html('Stop');
  } else {
    playMode = false;
    button.html('Play');
  }
}

function createYearMenu() {
  yearSelect = createSelect();
  yearSelect.position(250, 30);
  yearSelect.style('font-size', '20px');
  yearSelect.style('color','#212121');
  yearSelect.style('padding-left', '40px');
  yearSelect.style('height', '40px');
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
  background('#212121');
  updateFlowers(mode);
  visualizeText();
}

function createMonthMenu() {
  monthSelect = createSelect();
  monthSelect.position(430, 30);
  monthSelect.style('font-size', '20px');
  monthSelect.style('color','#212121');
  monthSelect.style('padding-left', '20px');
  monthSelect.style('height', '40px');
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
  background('#212121');
  updateFlowers(mode);
  visualizeText();
}

function createModeMenu() {
  modeSelect = createSelect();
  modeSelect.position(630, 30);
  modeSelect.style('font-size', '20px');
  modeSelect.style('color','#212121');
  modeSelect.style('padding-left', '20px');
  modeSelect.style('height', '40px');
  modeSelect.style('width', '250px');
  modeSelect.style('line-height', '40px');
  modeSelect.style('background', '#fff');
  modeSelect.style('border-radius', '40px');
  modeSelect.option('Geography');
  modeSelect.option('Grid');
  modeSelect.selected(mode);
  modeSelect.changed(modeChanged);
}

function modeChanged() {
  mode = modeSelect.value();
  background('#212121');
  updateFlowers(mode);
  visualizeText();
}
