const db = require('../db');
const partialUpdate = require("../helpers/partialUpdate");
const createArray = require('../helpers/createArray');

class Guide {
  static async findAll(data) {
    let baseQuery = ` 
    SELECT first_name, last_name, location, is_guide, image_url, bio, type, AVG(rating)::NUMERIC(10,2)
        FROM guide_profiles 
        JOIN user_profiles
        ON guide_profiles.id=user_profiles.id
        JOIN reviews
        ON guide_profiles.id=reviews.of_user_id
        WHERE is_guide = $1`;
    
    let whereExpressions = [];
    let queryValues = ['TRUE']
    let groupExpressions = ' GROUP BY first_name, last_name, location, is_guide, image_url, bio, type;'

    // if (data.coordinates) {

    // }

    if (data.type && data.type.length) {
      baseQuery += " AND ";
      let types = data.type.split(',');
      types.forEach(x => {
        queryValues.push(x);
        whereExpressions.push(`$${queryValues.length} = ANY (type)`);
      });
    }

    let finalQuery = baseQuery + whereExpressions.join(" AND ") + groupExpressions;
    const guidesRes = await db.query(finalQuery, queryValues);
    return guidesRes.rows;
  }

  static async findOne(id) {
    const guideRes = await db.query(
      `SELECT first_name, last_name, location, image_url, bio, type
          FROM guide_profiles
          JOIN user_profiles
          ON guide_profiles.id=user_profiles.id
          WHERE guide_profiles.id=$1`,
      [id]
    );
    
    const guide = guideRes.rows[0]

    if (!guide) {
      const notFound = new Error(`Can't find guide.`);
      notFound.status = 404;
      throw notFound
    };

    const reviewsRes = await db.query(
      `SELECT by_user_id, content, time_stamp, rating
          FROM reviews
          JOIN guide_profiles
          ON guide_profiles.id=reviews.of_user_id
          WHERE guide_profiles.id=$1`,
      [id]
    );

    guide.reviews = reviewsRes.rows;
    return guide;
  }

  static async create(data) {
    if (data.type) data.type = createArray(data.type)

    const result = await db.query(
      `INSERT INTO guide_profiles (id, coordinates, bio, type)
          VALUES ($1, $2, $3, $4)
          RETURNING *;`,
      [data.id, data.coordinates, data.bio, data.type]
    );

    await db.query(
      `UPDATE user_profiles 
          SET is_guide=TRUE 
          WHERE id=$1;`,
      [data.id]
    );

    return result.rows[0];
  }

  static async update(id, data) {
    if (data.type) data.type = createArray(data.type)

    let { query, values } = partialUpdate(
      "guide_profiles",
      data,
      "id",
      id
    );

    const result = await db.query(query, values);
    const guide = result.rows[0];

    if (!guide) {
      let notFound = new Error("Can't find guide.");
      notFound.status = 404;
      throw notFound;
    }

    return guide;
  }

  static async remove(id) {
    let result = await db.query(
      `DELETE FROM guide_profiles
          WHERE id=$1
          RETURNING id;`,
      [id]
    );

    await db.query(
      `UPDATE user_profiles
          SET is_guide=FALSE
          WHERE id=$1`,
      [id]
    );

    if (result.rows.length === 0) {
      let notFound = new Error("Can't find guide.");
      notFound.status = 404;
      throw notFound;
    }
  }
}

module.exports = Guide;