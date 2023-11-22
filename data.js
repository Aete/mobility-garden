const guCode = [
  { code: 11110, nameKR: 'Jongno-gu', x: 126.9773213, y: 37.59491732 },
  { code: 11140, nameKR: 'Jung-gu', x: 126.9959681, y: 37.56014356 },
  { code: 11170, nameKR: 'Yongsan-gu', x: 126.979907, y: 37.53138497 },
  { code: 11200, nameKR: 'Seongdong-gu', x: 127.0410585, y: 37.55102969 },
  { code: 11215, nameKR: 'Gwangjin-gu', x: 127.0857435, y: 37.54670608 },
  { code: 11230, nameKR: 'Dongdaemun-gu', x: 127.0548481, y: 37.58195655 },
  { code: 11260, nameKR: 'Jungnang-gu', x: 127.0928803, y: 37.59780259 },
  { code: 11290, nameKR: 'Seongbuk-gu', x: 127.017579, y: 37.6057019 },
  { code: 11305, nameKR: 'Gangbuk-gu', x: 127.011189, y: 37.64347391 },
  { code: 11320, nameKR: 'Dobong-gu', x: 127.0323688, y: 37.66910208 },
  { code: 11350, nameKR: 'Nowon-gu', x: 127.0750347, y: 37.65251105 },
  { code: 11380, nameKR: 'Eunpyeong-gu', x: 126.9270229, y: 37.61921128 },
  { code: 11410, nameKR: 'Seodaemun-gu', x: 126.9390631, y: 37.57778531 },
  { code: 11440, nameKR: 'Mapo-gu', x: 126.90827, y: 37.55931349 },
  { code: 11470, nameKR: 'Yangcheon-gu', x: 126.8554777, y: 37.52478941 },
  { code: 11500, nameKR: 'Gangseo-gu', x: 126.822807, y: 37.56123543 },
  { code: 11530, nameKR: 'Guro-gu', x: 126.8563006, y: 37.49440543 },
  { code: 11545, nameKR: 'Geumcheon-gu', x: 126.9008202, y: 37.46056756 },
  { code: 11560, nameKR: 'Yeongdeungpo-gu', x: 126.9101695, y: 37.52230829 },
  { code: 11590, nameKR: 'Dongjak-gu', x: 126.9516415, y: 37.49887688 },
  { code: 11620, nameKR: 'Gwanak-gu', x: 126.9453372, y: 37.46737569 },
  { code: 11650, nameKR: 'Seocho-gu', x: 127.0312203, y: 37.47329547 },
  { code: 11680, nameKR: 'Gangnam-gu', x: 127.0629852, y: 37.49664389 },
  { code: 11740, nameKR: 'Gangdong-gu', x: 127.115295, y: 37.50561924 },
  { code: 11710, nameKR: 'Songpa-gu', x: 127.1470118, y: 37.55045024 },
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

const uniqueYear = ['2019', '2020', '2021', '2022'];

let uniqueMonth;
let uniqueCode;

function preload() {
  // 데이터 기반의 객체 하나 만들기
  d3.csv('./data/living_pop.csv').then((csv) => {
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

    const projection = d3
      .geoMercator()
      .center([126.9895, 37.5651])
      .scale(110000)
      .translate([windowWidth / 2, windowHeight / 2 - 50]);

    for (let i = 0; i < uniqueCode.length; i++) {
      const code = uniqueCode[i];
      flowers[code] = {};
      for (const year of uniqueYear) {
        flowers[code][year] = {};
        for (let m = 1; m < 13; m++) {
          const gu = guCode.filter((d) => d.code === parseInt(code))[0];
          const coord = projection([gu.x, gu.y]);
          const flower = new Flower(
            coord[0],
            coord[1],
            data[code][year][m],
            gu['nameKR'],
            170 + (i % 5) * 165,
            160 + Math.floor(i / 5) * 190
          );
          flowers[code][year][m] = flower;
        }
      }
    }
  });
}
