const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const { authRequired } = require('../middleware/auth');

router.get('/', authRequired, async (req, res, next) => {
  try {
    const sent = await Message.findAllSent(req.id);
    const received = await Message.findAllReceived(req.id);

    return res.json({ sent, received });
  } catch (err) {
    return next(err);
  }
});

router.get('/:message_id', authRequired, async (req, res, next) => {
  try {
    const message = await Message.findOne(req.params.message_id, req.id);
    return res.json({ message })
  } catch (err) {
    return next(err);
  }
});

router.post('/', authRequired, async (req, res, next) => {
  req.body.from_user_id = req.id;
  try {
    const message = await Message.create(req.body);
    return res.status(201).json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;