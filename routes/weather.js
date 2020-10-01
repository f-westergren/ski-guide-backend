const express = require('express');
const router = express.Router();
const axios = require('axios');
const { WEATHER_API_KEY } = require('../config');

const BASE_URL = 'http://api.openweathermap.org/data/2.5';

router.get('/today', async (req, res, next) => {
  const params = {
    lat: req.query.lat,
    lon: req.query.lon,
    appid: WEATHER_API_KEY,
    units: 'metric'
  }

  try {
    const result = await axios.get(`${BASE_URL}/weather`, { params });
    res.json({ weather: result.data })
  } catch (err) {
    return next(err);
  }
});

router.get('/forecast', async (req, res, next) => {
  const params = {
    lat: req.query.lat,
    lon: req.query.lon,
    appid: WEATHER_API_KEY,
    units: 'metric'
  }

  try {
    const result = await axios.get(`${BASE_URL}/forecast`, { params });
    res.send({ weather: result.data })
  } catch (err) {
    return next(err);
  }
});

module.exports = router;