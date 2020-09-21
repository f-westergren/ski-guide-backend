const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

const authRequired = (req, res, next) => {
  try {
    const tokenStr = req.body._token || req.query._token;
    let token = jwt.verify(tokenStr, SECRET);
    console.log("TOKEN", token.id)
    req.id = token.id;
    return next();
  } catch (err) {
    let unauthorized = new Error('You must authenticate first.');
    unauthorized.status = 401;
    return next(unauthorized);
  }
}

const ensureCorrectUser = (req, res, next) => {
  try {
    const tokenStr = req.body._token || req.query._token;

    let token = jwt.verify(tokenStr, SECRET);
    req.id = token.id;

    if (token.id === +req.params.id) {
      return next();
    }

    throw new Error();
  } catch (err) {
    const unauthorized = new Error('You are not authorized.');
    unauthorized.status = 401;

    return next(unauthorized);
  }
}

module.exports = { 
  authRequired, 
  ensureCorrectUser
};