const express = require('express');
const router = express.Router();
const Guide = require('../models/guide');
const { authRequired, ensureCorrectUser } = require('../middleware/auth');
const User = require('../models/user');

router.get('/', async (req, res, next) => {
  try {
    const guides = await Guide.findAll(req.query);
    return res.json({ guides });
  } catch (err) {
    return next(err);
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const guide = await Guide.findOne(req.params.id);
    return res.json({ guide })
  } catch (err) {
    return next(err);
  }
})

router.post('/', authRequired, async (req, res, next) => {
  try {
    req.body.id = req.id;
    const guide = await Guide.create(req.body);
    return res.status(201).json({ guide });
  } catch (err) {
    return next(err);
  }
})

router.patch('/:id', ensureCorrectUser, async (req, res, next) => {
  try {
    const guide = await Guide.update(req.params.id, req.body);
    return res.json({ guide });
  } catch (err) {
    return next(err)
  };
})

router.delete('/:id', ensureCorrectUser, async (req, res, next) => {
  try {
    await Guide.remove(req.params.id);
    return res.json({ message: 'Guide deleted' });
  } catch (err) {
    return next(err);
  }
})

module.exports = router;