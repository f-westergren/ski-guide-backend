const Joi = require('joi');

const newMessage = Joi.object({
  to_user_id: Joi.number().required(),
  content: Joi.string().required(),
  _token: Joi.string()
});


module.exports = newMessage