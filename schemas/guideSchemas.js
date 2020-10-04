const Joi = require('joi');

const newGuide = Joi.object({
  location: Joi.string().required(),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  bio: Joi.string().required(),
  type: Joi.string().required(),
  _token: Joi.string()
})

const updateGuide = Joi.object({
  location: Joi.string(),
  lat: Joi.number(),
  lng: Joi.number(),
  bio: Joi.string(),
  type: Joi.string(),
  _token: Joi.string()
})

module.exports = { newGuide, updateGuide }