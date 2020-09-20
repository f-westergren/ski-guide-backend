const db = require('../db');
const bcrypt = require('bcrypt');

const BCRYPT_WORK_FACTOR = 10;

const partialUpdate = require('../helpers/partialUpdate');

class User {

  static async authenticate(data) {
    const result = await db.query(
    `SELECT id, email, password
      FROM users
      WHERE email = $1`,
      [data.email]
    );

    const user = result.rows[0];
    if (user) {
      const validPass = await bcrypt.compare(data.password, user.password);
      if (validPass) {
        return user;
      }
    }

    const invalidPass = new Error('Invalid credentials.');
    invalidPass.status = 401;
    throw invalidPass;
  }

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
      `WITH ins1 AS (
        INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING id as user_id
        ),
      ins2 AS (
        INSERT INTO user_profiles 
        (id, first_name, last_name, skill_level, location, image_url)
      VALUES 
        ((SELECT user_id FROM ins1), $3, $4, $5, $6, $7)
        )
      SELECT * FROM ins1;`,
      [
        data.email,
        hashedPassword,
        data.first_name,
        data.last_name,
        data.skill_level,
        data.location,
        data.image_url
      ]);

    console.log(result.rows[0])
    return result.rows[0];
  }

  static async findOne(id) {
    const userRes = await db.query(
      `SELECT email, first_name, last_name, skill_level, location, image_url
          FROM users JOIN user_profiles
          ON users.id=user_profile.id
          WHERE users.id = $1`,
      [id]);
    
    const user = userRes.rows[0];

    if (!user) {
      const error = new Error(`Can't find user.`);
      error.status = 404;
      throw error;
    }

    return user;
  }

  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }
  
    let {query, values} = partialUpdate(
      "users",
      data,
      "id",
      id
    );
    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      let notFound = new Error("Can't find user.")
      notFound.status = 404;
      throw notFound;
    }

    delete user.password;

    return result.rows[0];
  }

  static async remove(id) {
    let result = await db.query(
      `DELETE FROM users 
      WHERE id=$1
      RETURNING id`, [id]);
    if (result.rows.length === 0) {
      let notFound = new Error(`Can't find user.`)
      notFound.status = 404;
      throw notFound;
    }
  }
}

module.exports = User;