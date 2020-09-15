const express = require('express');
const User = require('../../../../43_react_jobly/backend/models/user');
const router = express.Router();

const User = require('../models/user');

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne(req.params.id);
    return res.json({ user })
  } catch (err) {
    return next(err);
  }
})


