const jwt = require('jsonwebtoken');

const { SECRET } = require('../config');

const createToken = (user) => {
  let payload = {
    id: user.id
  }

  return jwt.sign(payload, SECRET);
}

module.exports = createToken;