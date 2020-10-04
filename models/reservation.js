const db = require('../db');
const partialUpdate = require('../helpers/partialUpdate');

class Reservation {
  static async findAllAsUser(user_id) {
    const userReservations = await db.query(
      `SELECT reservations.id, date, guide_id, user_id, is_confirmed, first_name 
          FROM reservations JOIN user_profiles
          ON reservations.guide_id=user_profiles.id
          WHERE user_id=$1;`,
      [user_id]
    );
    return userReservations.rows;
  }

  static async findAllAsGuide(guide_id) {
    const guideReservations = await db.query(
      `SELECT reservations.id, date, guide_id, user_id, is_confirmed, first_name
          FROM reservations JOIN user_profiles
          ON reservations.user_id=user_profiles.id
          WHERE guide_id=$1;`,
      [guide_id]
    );
    return guideReservations.rows;
  }

  static async findOne(id, user_id) {
    const reservationRes = await db.query(
      `SELECT * FROM reservations 
          WHERE id=$1;`,
      [id]
    );
    
    const reservation = reservationRes.rows[0];

    if (reservation.guide_id !== +user_id && message.user_id !== +user_id) {
      let unauthorized = new Error('You are not authorized.')
      unauthorized.status = 401;
      throw unauthorized;
    }

    if (!reservation) {
      const notFound = new Error(`Can't find reservation.`);
      notFound.status = 404;
      throw notFound;
    }

    return reservation;
  }

  static async create(data) {
    const result = await db.query(
      `INSERT INTO reservations (date, user_id, guide_id)
          VALUES ($1, $2, $3)
          RETURNING *`,
      [data.date || new Date(), data.user_id, data.guide_id]
    );

    return result.rows[0];
  }

  static async update(id, data) {
    let {query, values} = partialUpdate(
      "reservations",
      data,
      "id",
      id
    );
    const result = await db.query(query, values);
    const reservation = result.rows[0];

    if (!reservation) {
      let notFound = new Error(`Can't find reservation.`);
      notFound.status = 404;
      throw notFound;
    }

    return reservation;
  }

  static async remove(id, user_id) {
    const result = await db.query(
      `DELETE FROM reservations
          WHERE id=$1
          AND user_id=$2
          OR (guide_id=$2)
          RETURNING id`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      let notFound = new Error(`Can't find reservation.`)
      notFound.status = 404;
      throw notFound;
    }
  }
}

module.exports = Reservation;