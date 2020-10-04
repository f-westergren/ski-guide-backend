const Joi = require('joi');

const newMessage = Joi.object({
  to_user_id: Joi.number().required(),
  content: Joi.string().required(),
  _token: Joi.string().allow(null, '')
});


module.exports = newMessage;