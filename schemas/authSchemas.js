const Joi = require('joi');

const newLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

module.exports = newLogin