const db = require('../db');

class Favorite {
  static async findAll(id) {
    const result = await db.query(
      `SELECT favorites.id, guide_id, first_name, image_url, location FROM favorites
          JOIN guide_profiles ON favorites.guide_id=guide_profiles.id
          JOIN user_profiles ON favorites.guide_id=user_profiles.id
          WHERE user_id=$1;`,
      [id]
    );
    return result.rows;
  }

  static async findOne(guide_id, user_id) {
    const result = await db.query(
      `SELECT * FROM favorites
          WHERE guide_id=$1 and user_id=$2`,
          [guide_id, user_id]
    );
    return result.rows[0];
  }

  static async create(guide_id, user_id) {
    const result = await db.query(
      `INSERT INTO favorites (guide_id, user_id)
          VALUES($1, $2)
          RETURNING *;`,
      [guide_id, user_id]
    );
    return result.rows[0];
  }

  static async remove(id, user_id) {
    const result = await db.query(
      `DELETE FROM favorites
          WHERE id=$1 AND user_id=$2
          RETURNING id;`,
      [id, user_id]
    );
    if (result.rows.length === 0) {
      let notFound = new Error(`Can't find favorite.`)
      notFound.status = 404;
      throw notFound;
    }      
  }
}

module.exports = Favorite;