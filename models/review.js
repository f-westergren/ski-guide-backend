const db = require('../db');

class Review {
  static async findAllBy(id) {
    const reviewRes = await db.query(
      `SELECT * FROM reviews
          WHERE by_user_id=$1;`,
      [id]
    );
    
    const reviews = reviewRes.rows[0];
    return reviews;
  }

  static async findAllOf(id) {
    const reviewRes = await db.query(
      `SELECT * FROM reviews
          WHERE of_user_id=$1;`,
      [id]
    );
    
    const reviews = reviewRes.rows[0];
    return reviews;
  }

  // static async findOne(id) {
  //   const reviewRes = await db.query(
  //     `SELECT * FROM reivews
  //         WHERE id=$1;`,
  //     [id]
  //   );

  //   const review = reviewRes.rows[0];
  //   return review;
  // }

  static async create(data) {
    // TODO: How to prevent users from reviewing without reservation?
    const result = await db.query(
      `INSERT INTO reviews (by_user_id, of_user_id, text, rating, time_stamp)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;`,
      [data.by_user_id, data.of_user_id, data.text, data.rating, new Date()]
    );

    return result.rows[0];
  }
}

module.exports = Review;