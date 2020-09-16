const express = require('express');
const router = express.Router();

const User = require('../models/user');

const createToken = require('../helpers/createToken');

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne(req.params.id);
    return res.json({ user })
  } catch (err) {
    return next(err);
  }
})

router.post('/', async (req, res, next) => {
  // TODO: Add validation.
  try {
    const newUser = await User.register(req.body);
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (e) {
    return next(e)
  }
})

router.patch('/:id', async (req, res, next) => {
  // How to prevent users from updating their email?
  try {
    await User.authenticate({
      id: req.params.id,
      password: req.body.password
    }); 

    delete req.body.password;
    // TODO: Add validation
    const user = await User.update(req.params.id, req.body);

    return res.json({ user })
  } catch (err) {
    return next(err);
  }
})
module.exports = router;


