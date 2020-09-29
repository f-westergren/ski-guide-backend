const jwt = require('jsonwebtoken');

const { SECRET } = require('../config');

const createToken = (user) => {
  let payload = {
    id: user.id,
    email: user.email,
    is_guide: user.is_guide
  }

  return jwt.sign(payload, SECRET);
}

module.exports = createToken;