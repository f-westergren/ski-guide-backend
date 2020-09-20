const jwt = require('jsonwebtoken');

const { SECRET } = require('../config');

const createToken = ({ user_id }) => {
  let payload = {
    id: user_id
  }

  return jwt.sign(payload, SECRET);
}

module.exports = createToken;