const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Message = require('../models/message');
const { ensureCorrectUser } = require('../middleware/auth');
const createToken = require('../helpers/createToken');

router.get('/:id', ensureCorrectUser, async (req, res, next) => {
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

router.patch('/:id', ensureCorrectUser, async (req, res, next) => {
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
});

router.delete('/:id', ensureCorrectUser, async (req, res, next) => {
  try {
    await User.remove(req.params.id);
    return res.json({ message: 'User deleted'});
  } catch (err) {
    return next(err);
  }
});

router.get('/:id/messages', async (req, res, next) => {
  // TODO: Add ensureCorrectUser.
  try {
    const sent = await Message.findAllSent(req.params.id);
    const received = await Message.findAllReceived(req.params.id);

    return res.json({ sent, received });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id/messages/:message_id', async (req, res, next) => {
  // TODO: Add ensureCorrectUser.
  try {
    const message = await Message.findOne(req.params.message_id, req.params.id);
    return res.json({ message })
  } catch (err) {
    return next(err);
  }
});

router.post('/:id/messages', async (req, res, next) => {
  // TODO: Add ensureCorrectUser.
  // TODO: Add validation
  req.body.from_user_id = req.params.id;
  try {
    const message = await Message.create(req.body);
    return res.status(201).json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;


