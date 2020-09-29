const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const { authRequired } = require('../middleware/auth');

router.get('/', authRequired, async (req, res, next) => {
  try {
    const asUser = await Reservation.findAllUser(req.id);
    if (req.is_guide) {
      const asGuide = await Reservation.findAllGuide(req.id);
      return res.json({ asUser, asGuide });
    }
    return res.json({ asUser })
  } catch (err) {
    return next(err);
  }
});

router.get('/:res_id', authRequired, async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne(req.params.res_id, req.id);
    return res.json({ reservation })
  } catch (err) {
    return next(err);
  }
});

router.post('/', authRequired, async (req, res, next) => {
  req.body.user_id = req.id;
  try {
    const result = await Reservation.create(req.body);
    return res.status(201).json({ result });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:res_id', authRequired, async (req, res, next) => {
  try {
    if ('id' in req.body) {
      return res.status(400).json({ message: 'Not allowed' });
    }
    // TODO: Find a way to ensure correct user without db call?
    const result = await Reservation.update(req.params.res_id, req.body);
    return res.json({ result });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:res_id', authRequired, async (req, res, next) => {
  try {
    await Reservation.remove(req.params.res_id);
    return res.json({ message: 'Reservation deleted' })
  } catch (err) {
    return next(err);
  }
})



module.exports = router;