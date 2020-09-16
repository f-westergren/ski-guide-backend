const jwt = require('jsonwebtoken');

const { SECRET } = require('../config');

const createToken = (user) => {
  let payload = {
    email: user.email
  }

  return jwt.sign(payload, SECRET);
}

module.exports = createToken;