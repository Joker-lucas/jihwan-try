const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기준점 Y좌표(GRID)

const DEGRAD = Math.PI / 180.0;
const RADDEG = 180.0 / Math.PI;

const re = RE / GRID;
const slat1 = SLAT1 * DEGRAD;
const slat2 = SLAT2 * DEGRAD;
const olon = OLON * DEGRAD;
const olat = OLAT * DEGRAD;

let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
sf = (sf ** sn * Math.cos(slat1)) / sn;

let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
ro = (re * sf) / ro ** sn;

const dfsXyConv = (code, v1, v2) => {
  const inputV1 = Number(v1);
  const inputV2 = Number(v2);

  const rs = {
    lat: 0, lng: 0, x: 0, y: 0,
  };

  if (code === 'toXY') {
    // 위경도 -> 격자좌표
    rs.lat = inputV1;
    rs.lng = inputV2;

    let ra = Math.tan(Math.PI * 0.25 + inputV1 * DEGRAD * 0.5);
    ra = (re * sf) / ra ** sn;

    let theta = inputV2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    rs.x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs.y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    // 격자좌표 -> 위경도
    rs.x = inputV1;
    rs.y = inputV2;

    const xn = inputV1 - XO;
    const yn = ro - inputV2 + YO;
    let ra = Math.sqrt(xn * xn + yn * yn);

    if (sn < 0.0) {
      ra = -ra;
    }

    let alat = ((re * sf) / ra) ** (1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    let theta = 0.0;
    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else if (Math.abs(yn) <= 0.0) {
      theta = Math.PI * 0.5;
      if (xn < 0.0) {
        theta = -theta;
      }
    } else {
      theta = Math.atan2(xn, yn);
    }

    const alon = theta / sn + olon;
    rs.lat = alat * RADDEG;
    rs.lng = alon * RADDEG;
  }

  return rs;
};

module.exports = {
  dfsXyConv,
};
