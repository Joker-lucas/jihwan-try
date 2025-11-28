const { weatherService } = require('../services');
const { response, error, errorDefinition } = require('../libs/common');

const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const getWeather = async (req, res) => {
  const {
    date, time, lat, lon,
  } = req.query;

  if (!date || !time || !lat || !lon) {
    throw new CustomError(ERROR_CODES.BAD_REQUEST);
  }

  const weatherData = await weatherService.getWeather(date, time, lat, lon);

  successResponse(res, weatherData);
};

module.exports = {
  getWeather,
};
