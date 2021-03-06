const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const { authRequired } = require('../middleware/auth');
const newFavorite = require('../schemas/favoriteSchemas');

router.get('/', authRequired, async (req, res, next) => {
  try {
    const favorites = await Favorite.findAll(req.id);
    return res.json({ favorites });
  } catch (err) {
    return next(err);
  }
});

// For checking if user has favorited a certain guide.
router.get('/:guide_id', authRequired, async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne(req.params.guide_id, req.id);
    return res.json(favorite);
  } catch (err) {
    return next(err);
  }
})

router.post('/', authRequired, async (req, res, next) => {
  const { error } = newFavorite.validate(req.body);
  if (error) return next({ status: 400, error: error.message });

  try {
    const favorite = await Favorite.create(req.body.guide_id, req.id);
    return res.status(201).json({ favorite });
   } catch (err) {
     return next(err);
   }
});

router.delete('/:id', authRequired, async (req, res, next) => {
  try {
    await Favorite.remove(req.params.id, req.id)
    return res.json({ message: 'Favorite deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;