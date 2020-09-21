const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const { authRequired } = require('../middleware/auth');

router.get('/', authRequired, async (req, res, next) => {
  try {
    const reviewsBy = await Review.findAllBy(req.id);
    const reviewsOf = await Review.findAllOf(req.id);

    return res.json({ reviewsBy, reviewsOf });
  } catch (err) {
    return next(err);
  }
});

router.post('/', authRequired, async (req, res, next) => {
  // Prevent users from leaving reviews if no reservation exists.
  req.body.by_user_id = req.id
  try {
    const review = await Review.create(req.body);
    return res.status(201).json({ review });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;