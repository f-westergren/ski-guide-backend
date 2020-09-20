const db = require('../db');

class Message {
  static async findAllSent(id) {
    const messageRes = await db.query(
      `SELECT * FROM messages
          WHERE from_user_id=$1;`, 
      [id]);

    const messages = messageRes.rows[0];
    return messages;
  }

  static async findAllReceived(id) {
    const messageRes = await db.query(
      `SELECT * FROM messages
          WHERE to_user_id=$1;
      `, [id]);

    const messages = messageRes.rows[0];
    return messages;
  }

  static async findOne(id, user_id) {
    const messageRes = await db.query(
      `SELECT * FROM messages
          WHERE id=$1;`, 
      [id]);

    const message = messageRes.rows[0];

    if (!message) {
      let notFound = new Error(`Can't find message.`);
      notFound.status = 404;
      throw notFound;
    }

    if (message.to_user_id !== +user_id && message.from_user_id !== +user_id) {
      let unauthorized = new Error('You are not authorized.')
      unauthorized.status = 401;
      throw unauthorized;
    }

    return message;
  }

  static async create(data) {
    const time = new Date();
    const result = await db.query(
      `INSERT INTO messages (from_user_id, to_user_id, content, time_stamp)
          VALUES ($1, $2, $3, $4)
          RETURNING *;`,
      [data.from_user_id, data.to_user_id, data.content, time]
    );

    return result.rows[0];
  }
}

module.exports = Message;