const Joi = require('joi');

// Uncomment date once functionality is implemented.

const newReservation = Joi.object({
  // date: Joi.date().required(),
  guide_id: Joi.number().required(),
  _token: Joi.string().allow(null, '')
});

const updateReservation = Joi.object({
  // date: Joi.date(),
  _token: Joi.string().allow(null, '')
});

module.exports = { newReservation, updateReservation };