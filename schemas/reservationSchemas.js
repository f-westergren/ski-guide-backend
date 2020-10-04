const Joi = require('joi');

const newReservation = Joi.object({
  date: Joi.date().required(),
  guide_id: Joi.number().required(),
  _token: Joi.string()
});

const updateReservation = Joi.object({
  date: Joi.date(),
  _token: Joi.string()
});

module.exports = { newReservation, updateReservation }