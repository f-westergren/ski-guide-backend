const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const { authRequired } = require('../middleware/auth');

router.get('/', authRequired, async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll(req.id);
    return res.json({ favorites });
  } catch (err) {
    return next(err);
  }
});

router.post('/', authRequired, async (req, res, next) => {
  try {
    const favorite = await Favorite.create(req.body.id, req.id);
    return res.status(201).json({ favorite });
   } catch (err) {
     return next(err);
   }
});

router.delete('/:id', authRequired, async (req, res, next) => {
  try {
    await Favorite.remove(id, req.id)
    return res.json({ message: 'Favorite removed' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;