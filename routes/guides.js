const express = require('express');
const router = express.Router();
const Guide = require('../models/guide');
const { authRequired, ensureCorrectUser } = require('../middleware/auth');
const createToken = require('../helpers/createToken');

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
  
  // Get geodata from coordinates.
  try {
    req.body.id = req.id;
    const guide = await Guide.create(req.body);
    const token = createToken(guide);
    return res.status(201).json({ token });
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
    const token = createToken({ id: req.id, is_guide: false });
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
})

module.exports = router;