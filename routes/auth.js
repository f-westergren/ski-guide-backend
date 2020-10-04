const User = require('../models/user');
const express = require('express');
const router = express.Router();
const createToken = require('../helpers/createToken');
const newLogin = require('../schemas/authSchemas');

router.post('/login', async (req, res, next) => {
  const { error } = newLogin.validate(req.body);
  if (error) return next({ status: 400, error: error.message });

  try {
    const user = await User.authenticate(req.body);
    const token = createToken(user);
    return res.json({ token })
  } catch(err) {
    return next(err);
  }
})

module.exports = router;
