const Joi = require('joi');

const newUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  skill_level: Joi.string().required(),
  image_url: Joi.string().allow(''),
  _token: Joi.string().allow(null, '')
});

const updateUser = Joi.object({
  email: Joi.string().email(),
  password: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  skill_level: Joi.string(),
  image_url: Joi.string(),
  _token: Joi.string().allow(null, '')
});

module.exports = { newUser, updateUser };