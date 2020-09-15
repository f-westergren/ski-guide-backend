const db = require('../db');
const bcrypt = require('bcrypt');

const BCRYPT_WORK_FACTOR = 10;

class User {
  static async register(data) {
    const duplicateCheck = await db.query(
      `SELECT email
        FROM users
        WHERE email = $1`,
        [data.email]
    );

    if (duplicateCheck.rows[0]) {
      const error = new Error(
        `Email ${data.email} already exists`
      )
      error.status = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
          (email, password, first_name, last_name, bio, skill_level, location, photo_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING email, password, first_name, last_name, bio, skill_level, location, photo_url`,
      [
        data.email,
        hashedPassword,
        data.first_name,
        data.last_name,
        data.bio,
        data.skill_level,
        data.location,
        data.photo_url
      ]);
    
    return result.rows[0];
  }

  static async findOne(id) {
    const userRes = await db.query(
      `SELECT email, first_name, last_name, bio, skill_level, location, photo_url
          FROM users
          WHERE id = $1`,
      [id]);
    
    const user = userRes.rows[0];

    if (!user) {
      const error = new Error(`There exists not user '${username}'`);
      error.status = 404;
      throw error;
    }
  }
}

module.exports = User;