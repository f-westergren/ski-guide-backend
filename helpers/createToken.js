const jwt = require('jsonwebtoken');

const { SECRET } = require('../config');

const createToken = (user) => {
  let payload = {
    id: user.id,
    is_guide: user.is_guide || false
  }

  return jwt.sign(payload, SECRET);
}

module.exports = createToken;