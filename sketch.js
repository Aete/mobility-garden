const data1 = [
  198013.1166,
  195576.008,
  194854.174,
  194612.3125,
  194345.6097,
  195347.0262,
  199780.7394,
  203299.4482,
  202602.551,
  204808.5569,
  210928.4814,
  219409.0808,
  229900.0578,
  241619.1448,
  249231.508,
  251777.5071,
  246737.1191,
  237575.9224,
  228844.8811,
  220434.1094,
  211096.0878,
  197653.3316,
  194507.6225,
  191393.7822,
  ]
  
  const data2 = [
  621553.7241,
  614869.2351,
  612385.1144,
  610626.9591,
  609125.2764,
  609978.6737,
  611220.5836,
  614406.9775,
  627561.5039,
  635711.4112,
  639188.1738,
  643244.9572,
  648364.1577,
  649617.8345,
  650349.029,
  654043.6462,
  653413.0523,
  653101.2136,
  648087.8921,
  644024.2246,
  638875.9354,
  627877.3752,
  611139.1794,
  601504.6244,
  ]

const dataset = [data1, data2];
const flowers = [];
let cScale;
const data_2022 = {};

function setup() {
  // 캔버스 생성
  createCanvas(4200, 7000);

  // 데이터 기반의 객체 하나 만들기
  d3.csv('./data/2022_monthly.csv').then((csv) =>{
    // get unique region codes
    const uniqueCode = csv.map((row)=>row['자치구코드']).filter((v,i,a)=> a.indexOf(v) === i);
    const uniqueMonth = csv.map((row)=>row['month']).filter((v,i,a)=> a.indexOf(v) === i);
    for(const c of uniqueCode){
      const regionData = csv.filter((row)=>row['자치구코드']===c)
      data_2022[c] = {};
      for(const m of uniqueMonth){
        const monthlyData = regionData.filter((row)=>row['month']===m)
        const monthlyPop = monthlyData.map((d)=>{
          const {male_pop, female_pop} = d;
          const popData = [male_pop, female_pop]
          return popData.map((pop)=>parseInt(pop));
        })
        data_2022[c][m] = monthlyPop;
      }
    }
    for(let i=0; i<uniqueCode.length; i++){
    for(let m=1; m<13; m++){
      const flower = new Flower(0 + m*150, 100+i*200, data_2022[uniqueCode[i]][m]);
      flowers.push(flower);
    }
  }
  })
  cScale = d3.scaleDiverging(d3.interpolateRdYlBu).domain([0.45, 0.5, 0.55]);
}

function draw() {
  background('#000');
  noLoop();
  noStroke();
  for (const f of flowers) {
    f.drawEdge();
    f.drawCenter();
  }

  //drawBee(flowers[0], flowers[1]);
}

function rScale(d) {
  return d * 0.00015;
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
    drawPoint(x, y, 1);
  }
}

class Flower {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.data = data;
  }

  drawCenter() {
    noStroke();
    const femaleAvg = this.data.map(d=>d[1]).reduce((d,acc)=>d+acc,0)/24
    const maleAvg = this.data.map(d=>d[0]).reduce((d,acc)=>d+acc,0)/24
    fill(cScale(maleAvg/(femaleAvg + maleAvg)));
    drawPoint(this.x, this.y, Math.sqrt(femaleAvg + maleAvg) * 0.05);
  }

  drawEdge() {
    // edge of the circle
    stroke('#424242');
    noFill();
    let totalPop = this.data[0][0] + this.data[0][1];
    let prevEdgeX = this.x + rScale(totalPop * Math.cos(- Math.PI/2));
    let prevEdgeY = this.y + rScale(totalPop * Math.sin(- Math.PI/2));
    console.log([...this.data, this.data[0]]);
    [...this.data, this.data[0]].forEach((d, i) => {
      const angle = ((2 * Math.PI) / 24) * i - Math.PI/2;
      totalPop = d[0] + d[1];
      const edgeX = this.x + rScale(totalPop * Math.cos(angle));
      const edgeY = this.y + rScale(totalPop * Math.sin(angle));
      line(prevEdgeX, prevEdgeY,edgeX, edgeY);
      prevEdgeX = edgeX;
      prevEdgeY = edgeY;
    });
    
    // petals
    this.data.forEach((d, i) => {
      const angle = ((2 * Math.PI) / 24) * i - Math.PI/2;
      push();
      noStroke();
      translate(this.x, this.y);
      rotate(angle);
      const scaledPop = rScale(d[0] + d[1]);
      const mRatio = d[0] / (d[0] + d[1]);
      console.log(scaledPop);
      fill('#424242');
      drawLine(0, 0, scaledPop, 0);
      fill(cScale(mRatio));
      if([0,4,8,12,16,20].includes(i)){
      for(let h=1; h<=scaledPop/6; h+=scaledPop/24){
        drawPetal(scaledPop,h);
      };
      for(let h=1; h<=scaledPop/6; h+=scaledPop/24){
        drawPetal(scaledPop,-h);
      };
     }
     drawPoint(scaledPop,0, 3);
      pop();
    });
  }
}

function drawPetal(endX, height){
  for(let i=0; i<endX; i++){
    const yPos = height * Math.sin(Math.PI*1/endX*i);
    drawPoint(i,yPos,1);
  }
}

function drawBee(flower1, flower2){
  const [x1, y1] = [flower1.x, flower1.y];
  const [x2, y2] = [flower2.x, flower2.y];

  stroke(255);
  line(x1, y1, x2, y2);

}