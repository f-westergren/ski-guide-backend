const db = require('../db');
const bcrypt = require('bcrypt');
const BCRYPT_WORK_FACTOR = 10;
const partialUpdate = require('../helpers/partialUpdate');

class User {
  static async authenticate(data) {
    const result = await db.query(
    `SELECT users.id, email, password, is_guide
        FROM users JOIN user_profiles 
        ON users.id=user_profiles.id
        WHERE users.id = $1
        OR (email=$2)`,
    [data.id, data.email]
    );

    const user = result.rows[0];
    if (user) {
      const validPass = await bcrypt.compare(data.password, user.password);
      if (validPass) {
        return { id: user.id, is_guide: user.is_guide };
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
        RETURNING id
        ),
      ins2 AS (
        INSERT INTO user_profiles 
        (id, first_name, last_name, skill_level, image_url)
      VALUES 
        ((SELECT id FROM ins1), $3, $4, $5, $6)
        )
      SELECT id FROM ins1;`,
      [
        data.email,
        hashedPassword,
        data.first_name,
        data.last_name,
        data.skill_level,
        data.image_url
      ]);
    
    return result.rows[0];
  }

  static async findOne(id) {
    const userRes = await db.query(
      `SELECT email, first_name, last_name, skill_level, image_url
          FROM users JOIN user_profiles
          ON users.id=user_profiles.id
          WHERE users.id = $1`,
      [id]
    );
    
    const user = userRes.rows[0];

    if (!user) {
      const notFound = new Error(`Can't find user.`);
      notFound.status = 404;
      throw notFound;
    }

    return user;
  }

  static async update(id, data) {
    // Email is in users table, so need to update it separately.
    let email = {};
    if (data.email) {
      email = await db.query(
        `UPDATE users 
          SET email=$1 WHERE id=$2
          RETURNING *`,
        [data.email, id]
      );
      delete data.email;
    }

    let {query, values} = partialUpdate(
      "user_profiles",
      data,
      "id",
      id
    );
    const result = await db.query(query, values);
    const user = {...result.rows[0], ...email}

    if (!user) {
      let notFound = new Error("Can't find user.");
      notFound.status = 404;
      throw notFound;
    }
    
    return result.rows[0];
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM users 
          WHERE id=$1
          RETURNING id`, 
      [id]
    );
    
    if (result.rows.length === 0) {
      let notFound = new Error(`Can't find user.`)
      notFound.status = 404;
      throw notFound;
    }
  }
}

module.exports = User;