const db = require('../db');
const partialUpdate = require('../helpers/partialUpdate');

class Reservation {
  static async findAllUser(user_id) {
    const userReservations = await db.query(
      `SELECT * FROM reservations
          WHERE user_id=$1;`,
      [user_id]
    );
    return userReservations.rows;
  }

  static async findAllGuide(guide_id) {
    const guideReservations = await db.query(
      `SELECT * FROM reservations WHERE
          guide_id=$1;`,
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
          RETURNING *;`,
      [data.date, data.user_id, data.guide_id]
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

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM reservations
          WHERE id=$1
          RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      let notFound = new Error(`Can't find reservation.`)
      notFound.status = 404;
      throw notFound;
    }
  }
}

module.exports = Reservation;