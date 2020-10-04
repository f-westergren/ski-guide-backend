const Joi = require('joi');

const newLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  _token: Joi.string().allow(null, '')
});

module.exports = newLogin;