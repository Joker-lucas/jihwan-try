const dayjs = require('dayjs');
const { get: httpGet } = require('../libs/http');
const { error, errorDefinition, conversion } = require('../libs/common');

const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const _getBaseDateTime = () => {
  const yesterday = dayjs().subtract(1, 'day');
  return {
    baseDate: yesterday.format('YYYYMMDD'),
    baseTime: '2300',
  };
};

const _getPageNo = (date) => {
  const reqDate = dayjs(date);
  const today = dayjs().startOf('day');

  if (reqDate.isBefore(today)) {
    throw new CustomError(ERROR_CODES.BAD_REQUEST);
  }

  const tomorrow = today.add(1, 'day');
  const dayAfterTomorrow = today.add(2, 'day');

  if (reqDate.isAfter(dayAfterTomorrow, 'day')) {
    throw new CustomError(ERROR_CODES.BAD_REQUEST);
  }

  if (reqDate.isSame(today, 'day')) {
    return 1;
  }
  if (reqDate.isSame(tomorrow, 'day')) {
    return 2;
  }
  if (reqDate.isSame(dayAfterTomorrow, 'day')) {
    return 3;
  }

  throw new CustomError(ERROR_CODES.BAD_REQUEST);
};

const getWeather = async (date, time, lat, lon) => {
  if (!process.env.WEATHER_API_KEY) {
    throw new CustomError(ERROR_CODES.WEATHER_API_ERROR);
  }

  const { x: nx, y: ny } = conversion.dfsXyConv('toXY', lat, lon);

  const { baseDate, baseTime } = _getBaseDateTime();
  const pageNo = _getPageNo(date);
  const formattedTime = time.replace(':', '');

  // 3. 기상청 API URL 생성
  const url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
  const params = {
    serviceKey: process.env.WEATHER_API_KEY,
    pageNo,
    numOfRows: 290,
    dataType: 'JSON',
    base_date: baseDate,
    base_time: baseTime,
    nx,
    ny,
  };

  const response = await httpGet(url, { params });

  const { header } = response.data.response;
  if (header.resultCode !== '00') {
    throw new CustomError(ERROR_CODES.WEATHER_API_ERROR);
  }

  const items = response.data.response.body.items.item;
  if (!items) {
    throw new CustomError(ERROR_CODES.BAD_REQUEST);
  }

  const weatherDataForTime = items.filter((item) => item.fcstTime === formattedTime);

  if (weatherDataForTime.length === 0) {
    return { message: '해당 시간에 맞는 예보 데이터가 없습니다.' };
  }

  const weatherResult = {
    date, // YYYY-MM-DD
    time, // HH:mm
  };

  weatherDataForTime.forEach((item) => {
    const value = item.fcstValue;
    let unit = '';

    switch (item.category) {
      case 'TMP': // 1시간 기온
        unit = '°C';
        weatherResult.temperature = `${value}${unit}`;
        break;
      case 'POP': // 강수확률
        unit = '%';
        weatherResult.precipitationProbability = `${value}${unit}`;
        break;
      case 'PCP': // 1시간 강수량
        unit = 'mm';
        weatherResult.precipitation = value;
        break;
      case 'REH': // 습도
        unit = '%';
        weatherResult.humidity = `${value}${unit}`;
        break;
      case 'SKY': { // 하늘상태
        // (맑음:1, 구름많음:3, 흐림:4)
        let sky;
        if (value === '1') sky = '맑음';
        else if (value === '3') sky = '구름많음';
        else if (value === '4') sky = '흐림';
        else sky = '알 수 없음';
        weatherResult.skyCondition = sky;
        break;
      }
      case 'WSD': // 풍속
        unit = 'm/s';
        weatherResult.windSpeed = `${value}${unit}`;
        break;
      default:
        break;
    }
  });
  return weatherResult;
};

module.exports = {
  getWeather,
};
