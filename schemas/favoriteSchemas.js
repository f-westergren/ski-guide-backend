const Joi = require('joi');

const newFavorite = Joi.object({
  guide_id: Joi.number().required(),
  _token: Joi.string()
})

module.exports = newFavorite